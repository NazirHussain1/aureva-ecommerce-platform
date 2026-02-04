const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body;

  try {
    // Get user cart
    const cartItems = await Cart.findAll({
      where: { userId: req.user.id },
      include: [{ model: Product }],
    });

    if (!cartItems.length) return res.status(400).json({ message: "Cart is empty" });

    // Build items array
    const items = cartItems.map((item) => ({
      productId: item.productId,
      name: item.Product.name,
      quantity: item.quantity,
      price: item.Product.price,
    }));

    // Calculate total price
    const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // Create order
    const order = await Order.create({
      userId: req.user.id,
      items,
      totalPrice,
      status: "pending",
      shippingAddress,
      paymentMethod,
    });

    // Clear user cart
    await Cart.destroy({ where: { userId: req.user.id } });

    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({ where: { userId: req.user.id } });
    res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get order details
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order || order.userId !== req.user.id)
      return res.status(404).json({ message: "Order not found" });
    res.status(200).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createOrder, getUserOrders, getOrderById };
