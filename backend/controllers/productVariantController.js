const ProductVariant = require("../models/ProductVariant");
const Product = require("../models/Product");

// Get all variants for a product
const getProductVariants = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const variants = await ProductVariant.findAll({
      where: { ProductId: productId, isActive: true },
      order: [['type', 'ASC'], ['value', 'ASC']]
    });

    // Group variants by type
    const groupedVariants = variants.reduce((acc, variant) => {
      if (!acc[variant.type]) {
        acc[variant.type] = [];
      }
      acc[variant.type].push(variant);
      return acc;
    }, {});

    res.json({
      product: {
        id: product.id,
        name: product.name,
        basePrice: product.price
      },
      variants: groupedVariants
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create product variant
const createProductVariant = async (req, res) => {
  try {
    const { productId } = req.params;
    const { name, value, type, priceAdjustment, stock, sku, images } = req.body;

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if variant already exists
    const existingVariant = await ProductVariant.findOne({
      where: { ProductId: productId, type, value }
    });

    if (existingVariant) {
      return res.status(400).json({ message: "Variant with this type and value already exists" });
    }

    const variant = await ProductVariant.create({
      ProductId: productId,
      name,
      value,
      type,
      priceAdjustment: priceAdjustment || 0,
      stock: stock || 0,
      sku,
      images: images || []
    });

    res.status(201).json({
      message: "Product variant created successfully",
      variant
    });
  } catch (error) {
    console.error(error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: "SKU must be unique" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// Update product variant
const updateProductVariant = async (req, res) => {
  try {
    const { variantId } = req.params;
    const updateData = req.body;

    const variant = await ProductVariant.findByPk(variantId);
    if (!variant) {
      return res.status(404).json({ message: "Product variant not found" });
    }

    await variant.update(updateData);

    res.json({
      message: "Product variant updated successfully",
      variant
    });
  } catch (error) {
    console.error(error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: "SKU must be unique" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// Delete product variant
const deleteProductVariant = async (req, res) => {
  try {
    const { variantId } = req.params;

    const variant = await ProductVariant.findByPk(variantId);
    if (!variant) {
      return res.status(404).json({ message: "Product variant not found" });
    }

    await variant.destroy();

    res.json({ message: "Product variant deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get variant by ID
const getVariantById = async (req, res) => {
  try {
    const { variantId } = req.params;

    const variant = await ProductVariant.findByPk(variantId, {
      include: [
        {
          model: Product,
          attributes: ['id', 'name', 'price', 'category', 'brand']
        }
      ]
    });

    if (!variant) {
      return res.status(404).json({ message: "Product variant not found" });
    }

    // Calculate final price
    const finalPrice = variant.Product.price + variant.priceAdjustment;

    res.json({
      ...variant.toJSON(),
      finalPrice
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Bulk create variants
const bulkCreateVariants = async (req, res) => {
  try {
    const { productId } = req.params;
    const { variants } = req.body;

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!Array.isArray(variants) || variants.length === 0) {
      return res.status(400).json({ message: "Variants array is required" });
    }

    // Add ProductId to each variant
    const variantsWithProductId = variants.map(variant => ({
      ...variant,
      ProductId: productId
    }));

    const createdVariants = await ProductVariant.bulkCreate(variantsWithProductId, {
      validate: true,
      ignoreDuplicates: true
    });

    res.status(201).json({
      message: `${createdVariants.length} variants created successfully`,
      variants: createdVariants
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getProductVariants,
  createProductVariant,
  updateProductVariant,
  deleteProductVariant,
  getVariantById,
  bulkCreateVariants
};