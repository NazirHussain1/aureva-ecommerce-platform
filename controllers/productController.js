const { Op } = require("sequelize");
const Product = require("../models/Product");
const NotificationService = require("../services/notificationService");

const getProducts = async (req, res) => {
  try {
    const { 
      category, 
      brand, 
      minPrice, 
      maxPrice, 
      search, 
      sortBy = 'createdAt', 
      sortOrder = 'DESC',
      page = 1,
      limit = 12
    } = req.query;

    // Build filter object
    let filter = {
      stock: { [Op.gt]: 0 },
    };

    // Category filter
    if (category) {
      filter.category = { [Op.iLike]: `%${category}%` };
    }

    // Brand filter
    if (brand) {
      filter.brand = { [Op.iLike]: `%${brand}%` };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price[Op.gte] = Number(minPrice);
      if (maxPrice) filter.price[Op.lte] = Number(maxPrice);
    }

    // Search functionality
    if (search) {
      filter[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { category: { [Op.iLike]: `%${search}%` } },
        { brand: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Pagination
    const offset = (page - 1) * limit;
    const parsedLimit = parseInt(limit);

    // Valid sort fields
    const validSortFields = ['name', 'price', 'createdAt', 'stock', 'category', 'brand'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const { count, rows: products } = await Product.findAndCountAll({
      where: filter,
      order: [[sortField, order]],
      limit: parsedLimit,
      offset: parseInt(offset),
      attributes: [
        'id', 'name', 'description', 'price', 'stock', 
        'category', 'brand', 'images', 'createdAt'
      ]
    });

    // Calculate pagination info
    const totalPages = Math.ceil(count / parsedLimit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalProducts: count,
        hasNextPage,
        hasPrevPage,
        limit: parsedLimit
      },
      filters: {
        category,
        brand,
        minPrice,
        maxPrice,
        search,
        sortBy: sortField,
        sortOrder: order
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    let product;
    
    if (isNaN(id)) {
      product = await Product.findOne({ where: { slug: id } });
    } else {
      product = await Product.findByPk(id);
    }
    
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const oldStock = product.stock;
    await product.update(req.body);

    // Check for low stock after update
    const lowStockThreshold = 5;
    if (product.stock <= lowStockThreshold && product.stock > 0) {
      await NotificationService.createLowStockAlert(
        product.id,
        product.name,
        product.stock,
        lowStockThreshold
      );
    }

    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.destroy();
    res.status(200).json({ message: "Product deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all categories
const getCategories = async (req, res) => {
  try {
    const categories = await Product.findAll({
      attributes: [
        'category',
        [require('sequelize').fn('COUNT', require('sequelize').col('category')), 'count']
      ],
      where: {
        stock: { [Op.gt]: 0 }
      },
      group: ['category'],
      order: [['category', 'ASC']]
    });

    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all brands
const getBrands = async (req, res) => {
  try {
    const brands = await Product.findAll({
      attributes: [
        'brand',
        [require('sequelize').fn('COUNT', require('sequelize').col('brand')), 'count']
      ],
      where: {
        stock: { [Op.gt]: 0 },
        brand: { [Op.ne]: null }
      },
      group: ['brand'],
      order: [['brand', 'ASC']]
    });

    res.json(brands);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Search products with advanced filters
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
      limit = 12
    } = req.query;

    if (!searchQuery) {
      return res.status(400).json({ message: "Search query is required" });
    }

    let filter = {};

    // Stock filter
    if (inStock === 'true') {
      filter.stock = { [Op.gt]: 0 };
    }

    // Category filter
    if (category) {
      filter.category = { [Op.iLike]: `%${category}%` };
    }

    // Brand filter
    if (brand) {
      filter.brand = { [Op.iLike]: `%${brand}%` };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price[Op.gte] = Number(minPrice);
      if (maxPrice) filter.price[Op.lte] = Number(maxPrice);
    }

    // Search across multiple fields
    filter[Op.or] = [
      { name: { [Op.iLike]: `%${searchQuery}%` } },
      { description: { [Op.iLike]: `%${searchQuery}%` } },
      { category: { [Op.iLike]: `%${searchQuery}%` } },
      { brand: { [Op.iLike]: `%${searchQuery}%` } }
    ];

    // Pagination
    const offset = (page - 1) * limit;
    const parsedLimit = parseInt(limit);

    const { count, rows: products } = await Product.findAndCountAll({
      where: filter,
      order: [
        // Prioritize exact matches in name
        [require('sequelize').literal(`CASE WHEN name ILIKE '%${searchQuery}%' THEN 1 ELSE 2 END`), 'ASC'],
        ['createdAt', 'DESC']
      ],
      limit: parsedLimit,
      offset: parseInt(offset)
    });

    const totalPages = Math.ceil(count / parsedLimit);

    res.json({
      products,
      searchQuery,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalResults: count,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit: parsedLimit
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get product suggestions for autocomplete
const getProductSuggestions = async (req, res) => {
  try {
    const { q: searchQuery, limit = 5 } = req.query;

    if (!searchQuery || searchQuery.length < 2) {
      return res.json({ suggestions: [] });
    }

    const suggestions = await Product.findAll({
      attributes: ['id', 'name', 'category', 'brand', 'price', 'images'],
      where: {
        stock: { [Op.gt]: 0 },
        [Op.or]: [
          { name: { [Op.iLike]: `%${searchQuery}%` } },
          { category: { [Op.iLike]: `%${searchQuery}%` } },
          { brand: { [Op.iLike]: `%${searchQuery}%` } }
        ]
      },
      order: [
        [require('sequelize').literal(`CASE WHEN name ILIKE '${searchQuery}%' THEN 1 ELSE 2 END`), 'ASC'],
        ['name', 'ASC']
      ],
      limit: parseInt(limit)
    });

    res.json({ suggestions });
  } catch (err) {
    console.error(err);
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
  getProductSuggestions
};
