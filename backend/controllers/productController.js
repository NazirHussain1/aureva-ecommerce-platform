const mongoose = require("mongoose");
const Product = require("../models/Product");
const NotificationService = require("../services/notificationService");
const { sendLowStockAlertEmail } = require("../services/emailService");

const escapeRegex = (value = "") => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const buildProductFilter = ({ category, brand, minPrice, maxPrice, search, inStock = true }) => {
  const filter = {};

  if (inStock) {
    filter.stock = { $gt: 0 };
  }

  if (category) {
    filter.category = { $regex: escapeRegex(category), $options: "i" };
  }

  if (brand) {
    filter.brand = { $regex: escapeRegex(brand), $options: "i" };
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  if (search) {
    const regex = { $regex: escapeRegex(search), $options: "i" };
    filter.$or = [
      { name: regex },
      { description: regex },
      { category: regex },
      { brand: regex },
    ];
  }

  return filter;
};

const getSortDirection = (sortOrder) => (String(sortOrder).toUpperCase() === "ASC" ? 1 : -1);

const lowStockThreshold = 5;

const notifyLowStock = async (product) => {
  if (product.stock <= lowStockThreshold && product.stock > 0) {
    await NotificationService.createLowStockAlert(
      product.id,
      product.name,
      product.stock,
      lowStockThreshold
    );
    sendLowStockAlertEmail(product, lowStockThreshold).catch(() => {});
  }
};

const getProducts = async (req, res) => {
  try {
    const {
      category,
      brand,
      minPrice,
      maxPrice,
      search,
      sortBy = "createdAt",
      sortOrder = "DESC",
      page = 1,
      limit = 12,
    } = req.query;

    const currentPage = Math.max(parseInt(page, 10) || 1, 1);
    const parsedLimit = Math.max(parseInt(limit, 10) || 12, 1);
    const skip = (currentPage - 1) * parsedLimit;
    const validSortFields = ["name", "price", "createdAt", "stock", "category", "brand"];
    const sortField = validSortFields.includes(sortBy) ? sortBy : "createdAt";
    const order = String(sortOrder).toUpperCase() === "ASC" ? "ASC" : "DESC";
    const filter = buildProductFilter({ category, brand, minPrice, maxPrice, search });

    const [products, count] = await Promise.all([
      Product.find(filter)
        .select("id slug name description price stock category brand images createdAt")
        .sort({ [sortField]: getSortDirection(order) })
        .skip(skip)
        .limit(parsedLimit),
      Product.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(count / parsedLimit);

    res.status(200).json({
      products,
      pagination: {
        currentPage,
        totalPages,
        totalProducts: count,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
        limit: parsedLimit,
      },
      filters: {
        category,
        brand,
        minPrice,
        maxPrice,
        search,
        sortBy: sortField,
        sortOrder: order,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getProductById = async (req, res) => {
  try {
    const normalizedParam = decodeURIComponent(String(req.params.id || "")).trim();
    let product = null;

    if (!normalizedParam) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (isValidObjectId(normalizedParam)) {
      product = await Product.findById(normalizedParam);
    }

    if (!product) {
      const legacyIdMatch = normalizedParam.match(/-([a-f\d]{24}|\d+)$/i);
      if (legacyIdMatch && isValidObjectId(legacyIdMatch[1])) {
        product = await Product.findById(legacyIdMatch[1]);
      }
    }

    if (!product) {
      product = await Product.findOne({ slug: normalizedParam.toLowerCase() });
    }

    if (!product) {
      product = await Product.findOne({
        name: { $regex: `^${escapeRegex(normalizedParam)}$`, $options: "i" },
      });
    }

    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, brand } = req.body;
    const imageUrl = req.file?.path;
    const product = await Product.create({
      ...req.body,
      name,
      description,
      price: Number(price),
      stock: parseInt(stock, 10),
      category,
      brand,
      images: imageUrl ? [imageUrl] : req.body.images,
    });

    await notifyLowStock(product);

    res.status(201).json({ success: true, product });
  } catch (err) {
    const message = err?.errors ? Object.values(err.errors)[0]?.message : "Server Error";
    res.status(500).json({ success: false, message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const payload = { ...req.body };
    if (payload.price !== undefined) payload.price = Number(payload.price);
    if (payload.stock !== undefined) payload.stock = parseInt(payload.stock, 10);
    if (req.file?.path) payload.images = [req.file.path];

    const product = await Product.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });

    if (!product) return res.status(404).json({ message: "Product not found" });

    await notifyLowStock(product);

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Product.aggregate([
      { $match: { stock: { $gt: 0 }, category: { $ne: null } } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, category: "$_id", count: 1 } },
    ]);

    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getBrands = async (req, res) => {
  try {
    const brands = await Product.aggregate([
      { $match: { stock: { $gt: 0 }, brand: { $nin: [null, ""] } } },
      { $group: { _id: "$brand", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, brand: "$_id", count: 1 } },
    ]);

    res.json(brands);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const searchProducts = async (req, res) => {
  try {
    const {
      q: searchQuery,
      category,
      brand,
      minPrice,
      maxPrice,
      inStock = true,
      page = 1,
      limit = 12,
    } = req.query;

    if (!searchQuery) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const currentPage = Math.max(parseInt(page, 10) || 1, 1);
    const parsedLimit = Math.max(parseInt(limit, 10) || 12, 1);
    const skip = (currentPage - 1) * parsedLimit;
    const filter = buildProductFilter({
      category,
      brand,
      minPrice,
      maxPrice,
      search: searchQuery,
      inStock: inStock === true || inStock === "true",
    });

    const [products, count] = await Promise.all([
      Product.find(filter)
        .sort({ name: 1, createdAt: -1 })
        .skip(skip)
        .limit(parsedLimit),
      Product.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(count / parsedLimit);

    res.json({
      products,
      searchQuery,
      pagination: {
        currentPage,
        totalPages,
        totalResults: count,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
        limit: parsedLimit,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getProductSuggestions = async (req, res) => {
  try {
    const { q: searchQuery, limit = 5 } = req.query;

    if (!searchQuery || searchQuery.length < 2) {
      return res.json({ suggestions: [] });
    }

    const regex = { $regex: escapeRegex(searchQuery), $options: "i" };
    const suggestions = await Product.find({
      stock: { $gt: 0 },
      $or: [{ name: regex }, { category: regex }, { brand: regex }],
    })
      .select("id slug name category brand price images")
      .sort({ name: 1 })
      .limit(parseInt(limit, 10) || 5);

    res.json({ suggestions });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getBrands,
  searchProducts,
  getProductSuggestions,
  getProductBySlug,
};
