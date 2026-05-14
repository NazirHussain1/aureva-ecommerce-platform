const Wishlist = require("../models/Wishlist");

const formatWishlist = (wishlist) => ({
  items: wishlist?.products?.map((product) => product.toJSON ? product.toJSON() : product) || [],
});

const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id }).populate("products");
    res.json(formatWishlist(wishlist));
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const exists = await Wishlist.findOne({
      user: req.user.id,
      products: productId,
    });

    if (exists) {
      return res.status(400).json({ message: "Already in wishlist" });
    }

    const item = await Wishlist.findOneAndUpdate(
      { user: req.user.id },
      { $addToSet: { products: productId } },
      { new: true, upsert: true, runValidators: true }
    ).populate("products");

    res.status(201).json(formatWishlist(item));
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const item = await Wishlist.findOneAndUpdate(
      { user: req.user.id, products: req.params.id },
      { $pull: { products: req.params.id } },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    await item.populate("products");
    res.json(formatWishlist(item));
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
