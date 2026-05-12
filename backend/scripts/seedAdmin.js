require('../config/loadEnv');
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const { connectDB } = require('../config/mongodb');

const adminData = {
  name: 'Nazir Hussain',
  email: 'nh534392@gmail.com',
  password: 'Nazir@1234',
  phone: '03321716508',
  role: 'admin'
};

const sampleProducts = [
  {
    name: 'Hydrating Face Serum',
    description: 'A lightweight, fast-absorbing serum that deeply hydrates and plumps the skin. Enriched with hyaluronic acid and vitamin E for a radiant, youthful glow.',
    price: 45.99,
    category: 'Skincare',
    brand: 'Aureva Essentials',
    stock: 50,
    images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500']
  },
  {
    name: 'Matte Liquid Lipstick - Ruby Red',
    description: 'Long-lasting matte liquid lipstick with intense color payoff. Comfortable formula that stays put all day without drying your lips.',
    price: 18.99,
    category: 'Makeup',
    brand: 'Aureva Beauty',
    stock: 100,
    images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500']
  },
  {
    name: 'Lavender Dream Hair Mask',
    description: 'Deep conditioning hair mask infused with lavender oil and keratin. Repairs damaged hair, adds shine, and leaves a calming scent.',
    price: 32.50,
    category: 'Haircare',
    brand: 'Aureva Naturals',
    stock: 75,
    images: ['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500']
  },
  {
    name: 'Vanilla Blossom Perfume',
    description: 'Elegant eau de parfum with notes of vanilla, jasmine, and sandalwood. A sophisticated scent that lasts all day.',
    price: 68.00,
    category: 'Fragrance',
    brand: 'Aureva Signature',
    stock: 40,
    images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=500']
  },
  {
    name: 'Luxury Nail Polish Set',
    description: 'Set of 5 premium nail polishes in trending colors. Quick-dry formula with long-lasting shine and chip resistance.',
    price: 24.99,
    category: 'Nails',
    brand: 'Aureva Colors',
    stock: 60,
    images: ['https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=500']
  },
  {
    name: 'Revitalizing Body Lotion',
    description: 'Rich, nourishing body lotion with shea butter and coconut oil. Absorbs quickly to leave skin soft, smooth, and hydrated.',
    price: 28.75,
    category: 'Body Care',
    brand: 'Aureva Spa',
    stock: 80,
    images: ['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500']
  },
  {
    name: 'Professional Makeup Brush Set',
    description: 'Complete 12-piece makeup brush set with synthetic bristles. Includes brushes for face, eyes, and lips. Comes with elegant storage case.',
    price: 54.99,
    category: 'Tools & Accessories',
    brand: 'Aureva Pro',
    stock: 45,
    images: ['https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500']
  },
  {
    name: 'Vitamin C Brightening Cream',
    description: 'Powerful brightening cream with 20% vitamin C complex. Reduces dark spots, evens skin tone, and boosts radiance.',
    price: 52.00,
    category: 'Skincare',
    brand: 'Aureva Clinical',
    stock: 55,
    images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500']
  },
  {
    name: 'Waterproof Mascara - Jet Black',
    description: 'Volumizing and lengthening waterproof mascara. Smudge-proof formula that stays perfect through rain, tears, and sweat.',
    price: 22.50,
    category: 'Makeup',
    brand: 'Aureva Beauty',
    stock: 90,
    images: ['https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=500']
  },
  {
    name: 'Argan Oil Hair Treatment',
    description: 'Pure Moroccan argan oil treatment for all hair types. Tames frizz, adds shine, and protects against heat damage.',
    price: 38.99,
    category: 'Haircare',
    brand: 'Aureva Naturals',
    stock: 65,
    images: ['https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500']
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Connect to MongoDB
    await connectDB();
    console.log('✅ Connected to MongoDB\n');

    // Create Admin User
    console.log('👤 Creating admin account...');
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    
    if (existingAdmin) {
      console.log('⚠️  Admin account already exists!');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Role: ${existingAdmin.role}\n`);
    } else {
      const admin = await User.create(adminData);
      console.log('✅ Admin account created successfully!');
      console.log(`   Name: ${admin.name}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Role: ${admin.role}\n`);
    }

    // Create Sample Products
    console.log('📦 Creating sample products...\n');
    
    // Clear existing products (optional - comment out if you want to keep existing)
    const existingProductsCount = await Product.countDocuments();
    if (existingProductsCount > 0) {
      console.log(`⚠️  Found ${existingProductsCount} existing products`);
      console.log('   Skipping product creation to preserve existing data\n');
    } else {
      let createdCount = 0;
      
      for (const productData of sampleProducts) {
        try {
          const product = await Product.create(productData);
          createdCount++;
          console.log(`✅ Created: ${product.name} (${product.category})`);
        } catch (error) {
          console.log(`❌ Failed to create: ${productData.name}`);
          console.log(`   Error: ${error.message}`);
        }
      }
      
      console.log(`\n✅ Successfully created ${createdCount}/${sampleProducts.length} products\n`);
    }

    // Summary
    console.log('📊 Database Summary:');
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalProducts = await Product.countDocuments();
    const categories = await Product.distinct('category');
    
    console.log(`   Total Users: ${totalUsers}`);
    console.log(`   Total Admins: ${totalAdmins}`);
    console.log(`   Total Products: ${totalProducts}`);
    console.log(`   Categories: ${categories.join(', ')}\n`);

    console.log('🎉 Database seeding completed!\n');
    console.log('📝 Admin Login Credentials:');
    console.log(`   Email: ${adminData.email}`);
    console.log(`   Password: ${adminData.password}`);
    console.log(`   Phone: ${adminData.phone}\n`);

    console.log('🚀 You can now:');
    console.log('   1. Start the backend: npm run dev:backend');
    console.log('   2. Start the frontend: npm run dev:frontend');
    console.log('   3. Login with admin credentials');
    console.log('   4. Access admin dashboard\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
