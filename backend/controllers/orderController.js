const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const { sendOrderConfirmationEmail } = require("../services/emailService");

const getOrderUserId = (order) => String(order?.user?._id || order?.user || "");

const normalizeShippingAddress = (shippingAddress = {}) => ({
  street: shippingAddress.street || [shippingAddress.addressLine1, shippingAddress.addressLine2].filter(Boolean).join(", "),
  city: shippingAddress.city,
  state: shippingAddress.state,
  zipCode: shippingAddress.zipCode,
  country: shippingAddress.country || "USA",
});

const placeOrder = async (req, res) => {
  const { items, shippingAddress, paymentMethod, paymentDetails, totalAmount } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "No order items" });
  }

  try {
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId || item.product);
      if (!product) {
        return res.status(400).json({ message: "Product not found" });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `${product.name} is out of stock`,
        });
      }

      product.stock -= Number(item.quantity);
      await product.save();

      orderItems.push({
        product: product.id,
        name: product.name,
        price: Number(item.price ?? product.price),
        quantity: Number(item.quantity),
        image: product.images?.[0],
      });
    }

    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      shippingAddress: normalizeShippingAddress(shippingAddress),
      paymentMethod,
      paymentDetails: paymentDetails || null,
      subtotal,
      totalAmount: Number(totalAmount ?? subtotal),
    });

    const user = await User.findById(req.user.id);
    await sendOrderConfirmationEmail(order.toJSON(), user);

    res.status(201).json({
      ...order.toJSON(),
      userId: getOrderUserId(order),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (getOrderUserId(order) !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const restoreOrderStock = async (order) => {
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (getOrderUserId(order) !== req.user.id) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (["shipped", "delivered", "cancelled", "returned"].includes(order.orderStatus)) {
      return res.status(400).json({ message: "Cannot cancel this order" });
    }

    order.orderStatus = "cancelled";
    await order.save();
    await restoreOrderStock(order);

    res.json({
      ...order.toJSON(),
      userId: getOrderUserId(order),
      message: "Order cancelled successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const returnOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (getOrderUserId(order) !== req.user.id) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.orderStatus !== "delivered") {
      return res.status(400).json({ message: "Cannot return this order" });
    }

    const returnWindowDays = 10;
    const deliveredAt = new Date(order.deliveredAt);
    const now = new Date();
    const diffDays = Math.floor((now - deliveredAt) / (1000 * 60 * 60 * 24));

    if (diffDays > returnWindowDays) {
      return res.status(400).json({ message: "Return period expired" });
    }

    order.orderStatus = "returned";
    await order.save();
    await restoreOrderStock(order);

    res.json({
      ...order.toJSON(),
      userId: getOrderUserId(order),
      message: "Return processed successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { placeOrder, getUserOrders, getOrderById, cancelOrder, returnOrder };
