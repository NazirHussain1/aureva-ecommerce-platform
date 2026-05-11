const Product = require("../models/Product");

const getValidationMessage = (error, fallback) =>
  error?.errors ? Object.values(error.errors)[0]?.message : fallback;

const normalizeProductPayload = (body, existingProduct = {}) => ({
  ...body,
  price: body.price !== undefined ? Number(body.price) : existingProduct.price,
  stock: body.stock !== undefined ? Number(body.stock) : existingProduct.stock,
});

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = await Product.create(normalizeProductPayload(req.body));
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: getValidationMessage(error, "Failed to create product") });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      normalizeProductPayload(req.body),
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(400).json({ message: getValidationMessage(error, "Failed to update product") });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product removed" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product" });
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
