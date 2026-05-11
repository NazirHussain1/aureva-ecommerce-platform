const Review = require("../models/Review");
const Product = require("../models/Product");

const updateProductReviewStats = async (productId) => {
  const reviews = await Review.find({ product: productId });
  const avg = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  await Product.findByIdAndUpdate(productId, {
    averageRating: Number(avg.toFixed(1)),
    numReviews: reviews.length,
  });
};

const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getProductReviewsBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const reviews = await Review.find({ product: product.id })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const review = await Review.findOneAndUpdate(
      { product: productId, user: req.user.id },
      { rating, comment, product: productId, user: req.user.id },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    await updateProductReviewStats(productId);

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    await updateProductReviewStats(review.product);

    res.json({ message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getProductReviews,
  getProductReviewsBySlug,
  createReview,
  deleteReview,
};
