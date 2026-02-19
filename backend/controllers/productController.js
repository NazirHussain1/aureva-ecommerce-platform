const { Op } = require("sequelize");
const Product = require("../models/Product");
const NotificationService = require("../services/notificationService");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const prismaConnectionString = process.env.DATABASE_URL;
const prismaPool = prismaConnectionString
  ? new Pool({
      connectionString: prismaConnectionString,
      ssl: prismaConnectionString.includes("supabase.co")
        ? { rejectUnauthorized: false }
        : undefined,
      allowExitOnIdle: true,
    })
  : null;
const prisma = prismaPool ? new PrismaClient({ adapter: new PrismaPg(prismaPool) }) : null;
const dialect = Product.sequelize?.getDialect?.() || "postgres";
const textLikeOp = dialect === "postgres" ? Op.iLike : Op.like;
const textLikeKeyword = dialect === "postgres" ? "ILIKE" : "LIKE";

const escapeSqlString = (value = "") => String(value).replace(/'/g, "''");

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
      filter.category = { [textLikeOp]: `%${category}%` };
    }

    // Brand filter
    if (brand) {
      filter.brand = { [textLikeOp]: `%${brand}%` };
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
        { name: { [textLikeOp]: `%${search}%` } },
        { description: { [textLikeOp]: `%${search}%` } },
        { category: { [textLikeOp]: `%${search}%` } },
        { brand: { [textLikeOp]: `%${search}%` } }
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
        'id', 'slug', 'name', 'description', 'price', 'stock', 
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
    const normalizedParam = decodeURIComponent(String(id || "")).trim();
    let product;

    if (!normalizedParam) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!Number.isNaN(Number(normalizedParam))) {
      product = await Product.findByPk(Number(normalizedParam));
    } else {
      // Legacy URLs like "my-product-12"
      const legacyIdMatch = normalizedParam.match(/-(\d+)$/);
      if (legacyIdMatch) {
        product = await Product.findByPk(Number(legacyIdMatch[1]));
      }

      if (!product) {
        product = await Product.findOne({ where: { slug: normalizedParam } });
      }

      if (!product) {
        product = await Product.findOne({
          where: require("sequelize").where(
            require("sequelize").fn("lower", require("sequelize").col("name")),
            normalizedParam.toLowerCase()
          ),
        });
      }
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
    if (!prisma) {
      return res
        .status(500)
        .json({ success: false, message: "Prisma database is not configured" });
    }

    const { name, description, price, stock, category, brand } = req.body;

    let imageUrl = null;
    if (req.file) {
      imageUrl = req.file.path;
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock, 10),
        category,
        brand,
        image: imageUrl,
      },
    });

    res.status(201).json({ success: true, product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
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
      filter.category = { [textLikeOp]: `%${category}%` };
    }

    // Brand filter
    if (brand) {
      filter.brand = { [textLikeOp]: `%${brand}%` };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price[Op.gte] = Number(minPrice);
      if (maxPrice) filter.price[Op.lte] = Number(maxPrice);
    }

    // Search across multiple fields
    filter[Op.or] = [
      { name: { [textLikeOp]: `%${searchQuery}%` } },
      { description: { [textLikeOp]: `%${searchQuery}%` } },
      { category: { [textLikeOp]: `%${searchQuery}%` } },
      { brand: { [textLikeOp]: `%${searchQuery}%` } }
    ];

    // Pagination
    const offset = (page - 1) * limit;
    const parsedLimit = parseInt(limit);

    const { count, rows: products } = await Product.findAndCountAll({
      where: filter,
      order: [
        // Prioritize exact matches in name
        [
          require("sequelize").literal(
            `CASE WHEN name ${textLikeKeyword} '%${escapeSqlString(searchQuery)}%' THEN 1 ELSE 2 END`
          ),
          "ASC",
        ],
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
      attributes: ['id', 'slug', 'name', 'category', 'brand', 'price', 'images'],
      where: {
        stock: { [Op.gt]: 0 },
        [Op.or]: [
          { name: { [textLikeOp]: `%${searchQuery}%` } },
          { category: { [textLikeOp]: `%${searchQuery}%` } },
          { brand: { [textLikeOp]: `%${searchQuery}%` } }
        ]
      },
      order: [
        [
          require("sequelize").literal(
            `CASE WHEN name ${textLikeKeyword} '${escapeSqlString(searchQuery)}%' THEN 1 ELSE 2 END`
          ),
          "ASC",
        ],
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

const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ where: { slug } });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
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
  getProductSuggestions,
  getProductBySlug
};
