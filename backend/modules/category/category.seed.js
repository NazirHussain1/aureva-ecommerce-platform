const Category = require('./category.model');
const { getCategoryIcon } = require('./category.icons');
const { generateCategorySlug, generateCanonicalUrl } = require('../../utils/slugGenerator');

/**
 * Seed Categories - Production-level Beauty eCommerce
 * Hierarchical structure similar to Sephora
 */

const seedCategories = async () => {
  try {
    console.log('🌱 Seeding categories...');
    
    // Clear existing categories (development only)
    // await Category.destroy({ where: {}, force: true });
    
    const categories = [
      // ============================================
      // SKINCARE (Parent)
      // ============================================
      {
        name: 'Skincare',
        description: 'Complete skincare solutions for all skin types',
        icon: 'GiLotionDrops',
        level: 0,
        displayOrder: 1,
        isFeatured: true,
        children: [
          {
            name: 'Cleansers',
            description: 'Face cleansers, makeup removers, and cleansing oils',
            icon: 'GiSoap',
            level: 1,
            displayOrder: 1,
            children: [
              { name: 'Gel Cleansers', icon: 'GiGel', level: 2, displayOrder: 1 },
              { name: 'Foam Cleansers', icon: 'GiBubbles', level: 2, displayOrder: 2 },
              { name: 'Oil Cleansers', icon: 'GiOilDrum', level: 2, displayOrder: 3 },
              { name: 'Micellar Water', icon: 'GiWaterDrop', level: 2, displayOrder: 4 }
            ]
          },
          {
            name: 'Moisturizers',
            description: 'Hydrating creams, lotions, and gels',
            icon: 'GiWaterDrop',
            level: 1,
            displayOrder: 2,
            children: [
              { name: 'Day Creams', icon: 'FaSun', level: 2, displayOrder: 1 },
              { name: 'Night Creams', icon: 'FaMoon', level: 2, displayOrder: 2 },
              { name: 'Face Oils', icon: 'GiOilDrum', level: 2, displayOrder: 3 },
              { name: 'Gel Moisturizers', icon: 'GiGel', level: 2, displayOrder: 4 }
            ]
          },
          {
            name: 'Serums',
            description: 'Targeted treatment serums',
            icon: 'GiChemicalDrop',
            level: 1,
            displayOrder: 3,
            children: [
              { name: 'Vitamin C Serums', icon: 'GiChemicalDrop', level: 2, displayOrder: 1 },
              { name: 'Hyaluronic Acid', icon: 'GiWaterDrop', level: 2, displayOrder: 2 },
              { name: 'Retinol Serums', icon: 'GiChemicalDrop', level: 2, displayOrder: 3 },
              { name: 'Niacinamide', icon: 'GiChemicalDrop', level: 2, displayOrder: 4 }
            ]
          },
          {
            name: 'Sunscreen',
            description: 'SPF protection for face and body',
            icon: 'FaSun',
            level: 1,
            displayOrder: 4
          },
          {
            name: 'Masks',
            description: 'Sheet masks, clay masks, and overnight masks',
            icon: 'FaMask',
            level: 1,
            displayOrder: 5,
            children: [
              { name: 'Sheet Masks', icon: 'FaMask', level: 2, displayOrder: 1 },
              { name: 'Clay Masks', icon: 'GiPowder', level: 2, displayOrder: 2 },
              { name: 'Overnight Masks', icon: 'FaMoon', level: 2, displayOrder: 3 }
            ]
          },
          {
            name: 'Eye Care',
            description: 'Eye creams, serums, and treatments',
            icon: 'FaEye',
            level: 1,
            displayOrder: 6
          },
          {
            name: 'Toners',
            description: 'Balancing and hydrating toners',
            icon: 'GiBottledBolt',
            level: 1,
            displayOrder: 7
          },
          {
            name: 'Exfoliators',
            description: 'Chemical and physical exfoliants',
            icon: 'GiSparkles',
            level: 1,
            displayOrder: 8
          }
        ]
      },
      
      // ============================================
      // MAKEUP (Parent)
      // ============================================
      {
        name: 'Makeup',
        description: 'Complete makeup collection for face, eyes, and lips',
        icon: 'FaPaintBrush',
        level: 0,
        displayOrder: 2,
        isFeatured: true,
        children: [
          {
            name: 'Face',
            description: 'Foundation, concealer, and face makeup',
            icon: 'GiPowder',
            level: 1,
            displayOrder: 1,
            children: [
              { name: 'Foundation', icon: 'GiPowder', level: 2, displayOrder: 1 },
              { name: 'Concealer', icon: 'FaCircle', level: 2, displayOrder: 2 },
              { name: 'Powder', icon: 'GiPowderBag', level: 2, displayOrder: 3 },
              { name: 'Primer', icon: 'GiBottledBolt', level: 2, displayOrder: 4 },
              { name: 'Setting Spray', icon: 'FaSprayCan', level: 2, displayOrder: 5 }
            ]
          },
          {
            name: 'Cheeks',
            description: 'Blush, bronzer, and highlighter',
            icon: 'FaHeart',
            level: 1,
            displayOrder: 2,
            children: [
              { name: 'Blush', icon: 'FaHeart', level: 2, displayOrder: 1 },
              { name: 'Bronzer', icon: 'FaSun', level: 2, displayOrder: 2 },
              { name: 'Highlighter', icon: 'FaStar', level: 2, displayOrder: 3 },
              { name: 'Contour', icon: 'GiPowder', level: 2, displayOrder: 4 }
            ]
          },
          {
            name: 'Eyes',
            description: 'Eyeshadow, eyeliner, and mascara',
            icon: 'FaEye',
            level: 1,
            displayOrder: 3,
            children: [
              { name: 'Eyeshadow', icon: 'FaEye', level: 2, displayOrder: 1 },
              { name: 'Eyeliner', icon: 'GiEyelashes', level: 2, displayOrder: 2 },
              { name: 'Mascara', icon: 'GiEyelashes', level: 2, displayOrder: 3 },
              { name: 'Eyebrow', icon: 'GiBrow', level: 2, displayOrder: 4 },
              { name: 'Eye Primer', icon: 'GiBottledBolt', level: 2, displayOrder: 5 }
            ]
          },
          {
            name: 'Lips',
            description: 'Lipstick, lip gloss, and lip care',
            icon: 'GiLipstick',
            level: 1,
            displayOrder: 4,
            children: [
              { name: 'Lipstick', icon: 'GiLipstick', level: 2, displayOrder: 1 },
              { name: 'Lip Gloss', icon: 'GiLips', level: 2, displayOrder: 2 },
              { name: 'Lip Liner', icon: 'GiLips', level: 2, displayOrder: 3 },
              { name: 'Lip Balm', icon: 'GiLips', level: 2, displayOrder: 4 }
            ]
          }
        ]
      },
      
      // ============================================
      // HAIRCARE (Parent)
      // ============================================
      {
        name: 'Haircare',
        description: 'Complete hair care and styling products',
        icon: 'GiComb',
        level: 0,
        displayOrder: 3,
        isFeatured: true,
        children: [
          {
            name: 'Shampoo',
            description: 'Cleansing shampoos for all hair types',
            icon: 'FaShower',
            level: 1,
            displayOrder: 1
          },
          {
            name: 'Conditioner',
            description: 'Nourishing conditioners',
            icon: 'GiWaterDrop',
            level: 1,
            displayOrder: 2
          },
          {
            name: 'Hair Treatments',
            description: 'Masks, oils, and serums',
            icon: 'GiHairStrands',
            level: 1,
            displayOrder: 3,
            children: [
              { name: 'Hair Masks', icon: 'GiHairStrands', level: 2, displayOrder: 1 },
              { name: 'Hair Oils', icon: 'GiOilDrum', level: 2, displayOrder: 2 },
              { name: 'Hair Serums', icon: 'GiChemicalDrop', level: 2, displayOrder: 3 }
            ]
          },
          {
            name: 'Styling',
            description: 'Hair styling products',
            icon: 'GiCurlyHair',
            level: 1,
            displayOrder: 4,
            children: [
              { name: 'Hair Spray', icon: 'FaSprayCan', level: 2, displayOrder: 1 },
              { name: 'Hair Gel', icon: 'GiGel', level: 2, displayOrder: 2 },
              { name: 'Mousse', icon: 'GiBubbles', level: 2, displayOrder: 3 },
              { name: 'Heat Protectant', icon: 'FaSun', level: 2, displayOrder: 4 }
            ]
          }
        ]
      },
      
      // ============================================
      // FRAGRANCE (Parent)
      // ============================================
      {
        name: 'Fragrance',
        description: 'Perfumes, colognes, and body mists',
        icon: 'GiPerfumeBottle',
        level: 0,
        displayOrder: 4,
        isFeatured: true,
        children: [
          { name: 'Perfume', icon: 'GiPerfumeBottle', level: 1, displayOrder: 1 },
          { name: 'Cologne', icon: 'GiBottledBolt', level: 1, displayOrder: 2 },
          { name: 'Body Mist', icon: 'FaSprayCan', level: 1, displayOrder: 3 }
        ]
      },
      
      // ============================================
      // BODY CARE (Parent)
      // ============================================
      {
        name: 'Body Care',
        description: 'Body lotions, scrubs, and treatments',
        icon: 'FaSpa',
        level: 0,
        displayOrder: 5,
        children: [
          { name: 'Body Wash', icon: 'FaShower', level: 1, displayOrder: 1 },
          { name: 'Body Lotion', icon: 'GiLotionDrops', level: 1, displayOrder: 2 },
          { name: 'Body Scrub', icon: 'GiSparkles', level: 1, displayOrder: 3 },
          { name: 'Hand Cream', icon: 'FaHandHoldingHeart', level: 1, displayOrder: 4 }
        ]
      },
      
      // ============================================
      // TOOLS & BRUSHES (Parent)
      // ============================================
      {
        name: 'Tools & Brushes',
        description: 'Makeup tools and accessories',
        icon: 'FaTools',
        level: 0,
        displayOrder: 6,
        children: [
          { name: 'Face Brushes', icon: 'FaPaintBrush', level: 1, displayOrder: 1 },
          { name: 'Eye Brushes', icon: 'FaPaintBrush', level: 1, displayOrder: 2 },
          { name: 'Sponges', icon: 'GiSponge', level: 1, displayOrder: 3 },
          { name: 'Brush Sets', icon: 'FaTools', level: 1, displayOrder: 4 }
        ]
      }
    ];
    
    // Recursive function to create categories
    const createCategoryTree = async (categoryData, parentId = null) => {
      const { children, ...data } = categoryData;
      
      // Generate slug
      data.slug = await generateCategorySlug(data.name);
      data.canonicalUrl = generateCanonicalUrl(data.slug);
      data.parentId = parentId;
      
      // Auto-generate meta fields
      if (!data.metaTitle) {
        data.metaTitle = `${data.name} - Premium Beauty Products`;
      }
      if (!data.metaDescription) {
        data.metaDescription = data.description || `Shop ${data.name} products`;
      }
      
      const category = await Category.create(data);
      console.log(`✅ Created: ${data.name} (Level ${data.level})`);
      
      // Create children recursively
      if (children && children.length > 0) {
        for (const child of children) {
          await createCategoryTree(child, category.id);
        }
      }
      
      return category;
    };
    
    // Create all categories
    for (const categoryData of categories) {
      await createCategoryTree(categoryData);
    }
    
    console.log('✅ Categories seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    throw error;
  }
};

module.exports = { seedCategories };
