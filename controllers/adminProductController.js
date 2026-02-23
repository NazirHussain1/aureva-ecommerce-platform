const Product = require("../models/Product");

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
        res.status(500).json({ message: "Failed to fetch products" });
  }
};

const createProduct = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      price: Number(req.body.price),
      stock: Number(req.body.stock),
    };

    const product = await Product.create(payload);
    res.status(201).json(product);
  } catch (error) {
        const message =
      error?.parent?.sqlMessage ||
      error?.errors?.[0]?.message ||
      "Failed to create product";
    res.status(400).json({ message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const payload = {
      ...req.body,
      price:
        req.body.price !== undefined ? Number(req.body.price) : product.price,
      stock:
        req.body.stock !== undefined ? Number(req.body.stock) : product.stock,
    };

    await product.update(payload);
    res.json(product);
  } catch (error) {
        const message =
      error?.parent?.sqlMessage ||
      error?.errors?.[0]?.message ||
      "Failed to update product";
    res.status(400).json({ message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.destroy();
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
