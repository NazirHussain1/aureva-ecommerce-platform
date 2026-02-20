const sequelize = require('../config/db');

const migrateToCategories = async () => {
  try {
    console.log('🔄 Migrating Product table...');
    
    // Add categoryId column
    await sequelize.query(`
      ALTER TABLE Products 
      ADD COLUMN IF NOT EXISTS categoryId INT NULL
    `);
    
    // Add gender column
    await sequelize.query(`
      ALTER TABLE Products 
      ADD COLUMN IF NOT EXISTS gender ENUM('MEN', 'WOMEN', 'UNISEX') DEFAULT 'UNISEX'
    `);
    
    // Add isActive column
    await sequelize.query(`
      ALTER TABLE Products 
      ADD COLUMN IF NOT EXISTS isActive BOOLEAN DEFAULT true
    `);
    
    // Add isDeleted column
    await sequelize.query(`
      ALTER TABLE Products 
      ADD COLUMN IF NOT EXISTS isDeleted BOOLEAN DEFAULT false
    `);
    
    // Add indexes
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_products_categoryId ON Products(categoryId)
    `);
    
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_products_gender ON Products(gender)
    `);
    
    console.log('✅ Migration complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
};

migrateToCategories();
