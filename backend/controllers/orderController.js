const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const Cart = require("../models/Cart");
const Coupon = require("../models/Coupon");
const { sendOrderConfirmationEmail } = require("../services/emailService");

const getOrderUserId = (order) => String(order?.user?._id || order?.user || "");

const normalizeShippingAddress = (shippingAddress = {}) => ({
  fullName: shippingAddress.fullName || shippingAddress.name,
  phone: shippingAddress.phone,
  address: shippingAddress.address || [shippingAddress.addressLine1, shippingAddress.addressLine2].filter(Boolean).join(", "),
  street: shippingAddress.street || shippingAddress.address || [shippingAddress.addressLine1, shippingAddress.addressLine2].filter(Boolean).join(", "),
  city: shippingAddress.city,
  state: shippingAddress.state,
  zipCode: shippingAddress.zipCode,
  country: shippingAddress.country || "USA",
});

const calculateCouponDiscount = (coupon, subtotal) => {
  if (!coupon) return 0;

  if (coupon.discountType === "percentage") {
    const percentageDiscount = (subtotal * coupon.discountValue) / 100;
    return coupon.maxDiscount ? Math.min(percentageDiscount, coupon.maxDiscount) : percentageDiscount;
  }

  return Math.min(coupon.discountValue, subtotal);
};

const placeOrder = async (req, res) => {
  const { items, shippingAddress, paymentMethod, paymentDetails, couponCode } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "No order items" });
  }

  const stockUpdates = [];

  try {
    const orderItems = [];

    for (const item of items) {
      const quantity = Number(item.quantity);
      const productId = item.productId || item.product;
      const product = await Product.findOneAndUpdate(
        { _id: productId, stock: { $gte: quantity } },
        { $inc: { stock: -quantity } },
        { new: true }
      );

      if (!product) {
        const existingProduct = await Product.findById(productId).select("name stock");
        const message = existingProduct
          ? `${existingProduct.name} has only ${existingProduct.stock} item(s) available`
          : "Product not found";
        await Promise.all(stockUpdates.map((update) =>
          Product.findByIdAndUpdate(update.product, { $inc: { stock: update.quantity } })
        ));
        return res.status(400).json({ message });
      }

      stockUpdates.push({ product: product.id, quantity });

      orderItems.push({
        product: product.id,
        name: product.name,
        price: Number(product.price),
        quantity,
        image: product.images?.[0],
      });
    }

    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let coupon = null;
    let discount = 0;

    if (couponCode) {
      coupon = await Coupon.findOne({ code: String(couponCode).toUpperCase() });

      if (!coupon || !coupon.isValid()) {
        await Promise.all(stockUpdates.map((update) =>
          Product.findByIdAndUpdate(update.product, { $inc: { stock: update.quantity } })
        ));
        return res.status(400).json({ message: "Invalid or expired coupon" });
      }

      if (subtotal < coupon.minPurchase) {
        await Promise.all(stockUpdates.map((update) =>
          Product.findByIdAndUpdate(update.product, { $inc: { stock: update.quantity } })
        ));
        return res.status(400).json({ message: `Minimum purchase amount is $${coupon.minPurchase}` });
      }

      discount = Number(calculateCouponDiscount(coupon, subtotal).toFixed(2));
    }

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      shippingAddress: normalizeShippingAddress(shippingAddress),
      paymentMethod,
      paymentDetails: paymentDetails || null,
      subtotal,
      discount,
      couponCode: coupon?.code,
      totalAmount: Number((subtotal - discount).toFixed(2)),
    });

    if (coupon) {
      coupon.usedCount += 1;
      await coupon.save();
    }

    await Cart.findOneAndUpdate({ user: req.user.id }, { items: [], totalAmount: 0 });

    const user = await User.findById(req.user.id);
    sendOrderConfirmationEmail(order.toJSON(), user).catch((emailError) => {
      console.error("Failed to send order confirmation email:", emailError.message);
    });

    res.status(201).json({
      ...order.toJSON(),
      userId: getOrderUserId(order),
    });
  } catch (error) {
    await Promise.all(stockUpdates.map((update) =>
      Product.findByIdAndUpdate(update.product, { $inc: { stock: update.quantity } })
    ));
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
