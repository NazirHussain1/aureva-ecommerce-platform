const Cart = require("../models/Cart");
const Product = require("../models/Product");

const getCart = async (req, res) => {
  try {
    const cartItems = await Cart.findAll({
      where: { userId: req.user.id },
      include: [{ model: Product }],
    });
    res.status(200).json(cartItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const existingItem = await Cart.findOne({
      where: { userId: req.user.id, productId },
    });

    if (existingItem) {
      existingItem.quantity += quantity;
      await existingItem.save();
      return res.status(200).json(existingItem);
    }

    const cartItem = await Cart.create({
      userId: req.user.id,
      productId,
      quantity,
    });

    res.status(201).json(cartItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateCartItem = async (req, res) => {
  const { quantity } = req.body;

  try {
    const cartItem = await Cart.findByPk(req.params.id);
    if (!cartItem || cartItem.userId !== req.user.id)
      return res.status(404).json({ message: "Cart item not found" });

    cartItem.quantity = quantity;
    await cartItem.save();
    res.status(200).json(cartItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const removeCartItem = async (req, res) => {
  try {
    const cartItem = await Cart.findByPk(req.params.id);
    if (!cartItem || cartItem.userId !== req.user.id)
      return res.status(404).json({ message: "Cart item not found" });

    await cartItem.destroy();
    res.status(200).json({ message: "Cart item removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem };
