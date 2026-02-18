const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Product = require("../models/Product");
const User = require("../models/User");
const { sendOrderConfirmationEmail } = require("../services/emailService");

const getOrderUserId = (order) => order?.userId ?? order?.UserId ?? null;

const placeOrder = async (req, res) => {
  const { items, shippingAddress, paymentMethod, paymentDetails, totalAmount } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "No order items" });
  }

  try {
    for (let item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) {
        return res.status(400).json({ message: "Product not found" });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `${product.name} is out of stock`,
        });
      }
      product.stock -= item.quantity;
      await product.save();
    }

    const order = await Order.create({
      userId: req.user.id,
      shippingAddress,
      paymentMethod,
      paymentDetails: paymentDetails || null,
      totalAmount,
    });

    const orderItems = items.map((item) => ({
      OrderId: order.id,
      ProductId: item.productId,
      quantity: item.quantity,
      price: item.price,
    }));

    await OrderItem.bulkCreate(orderItems);

    const user = await User.findByPk(req.user.id);
    const orderWithItems = { ...order.toJSON(), items };
    await sendOrderConfirmationEmail(orderWithItems, user);

    res.status(201).json({
      ...order.toJSON(),
      userId: getOrderUserId(order),
    });
  } catch (error) {
    console.error("Order placement error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [{ 
        model: OrderItem, 
        include: [Product] 
      }],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Get user orders error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [{ model: OrderItem, include: [Product] }],
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (getOrderUserId(order) !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);

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

    const orderItems = await OrderItem.findAll({ where: { OrderId: order.id } });
    for (let item of orderItems) {
      const product = await Product.findByPk(item.ProductId);
      product.stock += item.quantity;
      await product.save();
    }

    res.json({
      ...order.toJSON(),
      userId: getOrderUserId(order),
      message: "Order cancelled successfully",
    });
  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const returnOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);

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

    const orderItems = await OrderItem.findAll({ where: { OrderId: order.id } });
    for (let item of orderItems) {
      const product = await Product.findByPk(item.ProductId);
      product.stock += item.quantity;
      await product.save();
    }

    res.json({
      ...order.toJSON(),
      userId: getOrderUserId(order),
      message: "Return processed successfully",
    });
  } catch (error) {
    console.error("Return order error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { placeOrder, getUserOrders, getOrderById, cancelOrder, returnOrder };
