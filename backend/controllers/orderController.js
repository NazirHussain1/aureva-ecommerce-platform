const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Product = require("../models/Product");
const User = require("../models/User");
const { sendOrderConfirmationEmail } = require("../services/emailService");

const placeOrder = async (req, res) => {
  const { items, shippingAddress, paymentMethod, totalAmount } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "No order items" });
  }

  for (let item of items) {
    const product = await Product.findByPk(item.productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
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
    UserId: req.user.id,
    shippingAddress,
    paymentMethod,
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
    message: "Order placed successfully",
    orderId: order.id,
  });
};

// GET /api/orders/history - Get user's order history
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { UserId: req.user.id },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              attributes: ["id", "name", "images", "price", "category"],
            },
          ],
        },
      ],
    });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Cancel order
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);

    if (!order || order.UserId !== req.user.id) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Only orders not shipped yet
    if (["shipped", "delivered", "cancelled", "returned"].includes(order.orderStatus)) {
      return res.status(400).json({ message: "Cannot cancel this order" });
    }

    order.orderStatus = "cancelled";
    order.cancelReason = req.body.reason || null;

    // Rollback stock
    const orderItems = await OrderItem.findAll({ where: { OrderId: order.id } });
    for (let item of orderItems) {
      const product = await Product.findByPk(item.ProductId);
      product.stock += item.quantity;
      await product.save();
    }

    await order.save();

    res.json({ message: "Order cancelled successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Request return
const returnOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);

    if (!order || order.UserId !== req.user.id) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Only delivered orders can be returned
    if (order.orderStatus !== "delivered") {
      return res.status(400).json({ message: "Cannot return this order" });
    }

    const returnWindowDays = 10; // e.g., 10 days
    const deliveredAt = new Date(order.deliveredAt);
    const now = new Date();
    const diffDays = Math.floor((now - deliveredAt) / (1000 * 60 * 60 * 24));

    if (diffDays > returnWindowDays) {
      return res.status(400).json({ message: "Return period expired" });
    }

    order.orderStatus = "returned";
    order.returnReason = req.body.reason || null;
    order.returnRequestDate = new Date();

    // Rollback stock
    const orderItems = await OrderItem.findAll({ where: { OrderId: order.id } });
    for (let item of orderItems) {
      const product = await Product.findByPk(item.ProductId);
      product.stock += item.quantity;
      await product.save();
    }

    await order.save();

    res.json({ message: "Return processed successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { placeOrder, getUserOrders, cancelOrder, returnOrder };
