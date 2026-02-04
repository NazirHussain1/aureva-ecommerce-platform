const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");

const getWishlist = async (req, res) => {
  const items = await Wishlist.findAll({
    where: { userId: req.user.id },
    include: [Product],
  });
  res.json(items);
};

const addToWishlist = async (req, res) => {
  const { productId } = req.body;

  const exists = await Wishlist.findOne({
    where: { userId: req.user.id, productId },
  });

  if (exists) {
    return res.status(400).json({ message: "Already in wishlist" });
  }

  const item = await Wishlist.create({
    userId: req.user.id,
    productId,
  });

  res.status(201).json(item);
};

const removeFromWishlist = async (req, res) => {
  const item = await Wishlist.findByPk(req.params.id);

  if (!item || item.userId !== req.user.id) {
    return res.status(404).json({ message: "Item not found" });
  }

  await item.destroy();
  res.json({ message: "Removed from wishlist" });
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
