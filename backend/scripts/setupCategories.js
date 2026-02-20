/**
 * Setup Script for Enterprise Category System
 * Run this to initialize the category system
 */

const sequelize = require('../config/db');
const Category = require('../modules/category/category.model');
const { seedCategories } = require('../modules/category/category.seed');

const setupCategories = async () => {
  try {
    console.log('🚀 Starting Category System Setup...\n');
    
    // Step 1: Sync Category Model
    console.log('📦 Step 1: Syncing Category model...');
    await Category.sync({ alter: true });
    console.log('✅ Category model synced\n');
    
    // Step 2: Check if categories already exist
    const existingCount = await Category.count();
    
    if (existingCount > 0) {
      console.log(`⚠️  Found ${existingCount} existing categories`);
      console.log('Do you want to:');
      console.log('1. Keep existing categories');
      console.log('2. Clear and reseed');
      console.log('\nTo reseed, run: node scripts/setupCategories.js --force\n');
      
      if (!process.argv.includes('--force')) {
        console.log('✅ Setup complete (existing categories preserved)');
        process.exit(0);
      }
      
      console.log('🗑️  Clearing existing categories...');
      await Category.destroy({ where: {}, force: true });
      console.log('✅ Cleared\n');
    }
    
    // Step 3: Seed Categories
    console.log('🌱 Step 2: Seeding categories...');
    await seedCategories();
    console.log('');
    
    // Step 4: Verify
    const totalCategories = await Category.count();
    const parentCategories = await Category.count({ where: { level: 0 } });
    const childCategories = await Category.count({ where: { level: 1 } });
    const subChildCategories = await Category.count({ where: { level: 2 } });
    
    console.log('📊 Summary:');
    console.log(`   Total Categories: ${totalCategories}`);
    console.log(`   Parent Categories: ${parentCategories}`);
    console.log(`   Child Categories: ${childCategories}`);
    console.log(`   Sub-child Categories: ${subChildCategories}`);
    console.log('');
    
    console.log('✅ Category System Setup Complete!');
    console.log('');
    console.log('📝 Next Steps:');
    console.log('   1. Start your server: npm start');
    console.log('   2. Test API: GET http://localhost:5000/api/categories/tree');
    console.log('   3. View documentation: backend/modules/category/README.md');
    console.log('');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
};

// Run setup
setupCategories();
