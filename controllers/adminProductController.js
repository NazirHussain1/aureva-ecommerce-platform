const Product = require("../models/Product");

/* Get all products */
const getAllProducts = async (req, res) => {
  const products = await Product.findAll();
  res.json(products);
};

/* Create product */
const createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
};

/* Update product */
const updateProduct = async (req, res) => {
  const product = await Product.findByPk(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  await product.update(req.body);
  res.json(product);
};

/* Delete product */
const deleteProduct = async (req, res) => {
  const product = await Product.findByPk(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  await product.destroy();
  res.json({ message: "Product removed" });
};

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
