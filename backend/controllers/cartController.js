const Cart = require("../models/Cart");
const Product = require("../models/Product");

const findUserCart = (userId) => Cart.findOne({ user: userId }).populate("items.product");

const formatCartItem = (item) => {
  const product = item.product?.toJSON ? item.product.toJSON() : item.product;
  return {
    ...(product || {}),
    id: String(product?.id || product?._id || item.product),
    quantity: item.quantity,
    price: item.price,
  };
};

const formatCart = (cart) => ({
  items: cart?.items?.map(formatCartItem) || [],
  totalAmount: cart?.totalAmount || 0,
});

const getCart = async (req, res) => {
  try {
    const cart = await findUserCart(req.user.id);
    res.status(200).json(formatCart(cart));
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    const existingItem = cart.items.find((item) => item.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += Number(quantity);
    } else {
      cart.items.push({
        product: productId,
        quantity: Number(quantity),
        price: product.price,
      });
    }

    await cart.save();
    await cart.populate("items.product");

    res.status(existingItem ? 200 : 201).json(formatCart(cart));
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateCartItem = async (req, res) => {
  const { quantity } = req.body;

  try {
    const cart = await Cart.findOne({ user: req.user.id });
    const cartItem = cart?.items.find((item) => item.product.toString() === req.params.id);

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    cartItem.quantity = Number(quantity);
    await cart.save();
    await cart.populate("items.product");
    res.status(200).json(formatCart(cart));
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const removeCartItem = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    const cartItem = cart?.items.find((item) => item.product.toString() === req.params.id);

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    cart.items = cart.items.filter((item) => item.product.toString() !== req.params.id);
    await cart.save();
    await cart.populate("items.product");
    res.status(200).json(formatCart(cart));
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem };
