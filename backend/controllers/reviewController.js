const Review = require("../models/Review");
const Product = require("../models/Product");

const getProductReviews = async (req, res) => {
  const reviews = await Review.findAll({
    where: { productId: req.params.productId },
    include: ["User"],
    order: [["createdAt", "DESC"]],
  });

  res.json(reviews);
};

const createReview = async (req, res) => {
  const { rating, comment } = req.body;
  const { productId } = req.params;

  const product = await Product.findByPk(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  let review = await Review.findOne({
    where: { productId, userId: req.user.id },
  });

  if (review) {
    review.rating = rating;
    review.comment = comment;
    await review.save();
  } else {
    review = await Review.create({
      rating,
      comment,
      productId,
      userId: req.user.id,
    });
  }

  const reviews = await Review.findAll({ where: { productId } });

  const avg =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  product.averageRating = avg.toFixed(1);
  product.numReviews = reviews.length;
  await product.save();

  res.status(201).json(review);
};

const deleteReview = async (req, res) => {
  const review = await Review.findByPk(req.params.id);

  if (!review || review.userId !== req.user.id) {
    return res.status(404).json({ message: "Review not found" });
  }

  await review.destroy();

  const product = await Product.findByPk(review.productId);
  const reviews = await Review.findAll({
    where: { productId: review.productId },
  });

  if (reviews.length === 0) {
    product.averageRating = 0;
    product.numReviews = 0;
  } else {
    product.averageRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    product.numReviews = reviews.length;
  }

  await product.save();

  res.json({ message: "Review deleted" });
};

module.exports = {
  getProductReviews,
  createReview,
  deleteReview,
};
