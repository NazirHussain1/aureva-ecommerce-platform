require('dotenv').config();
const sequelize = require('../config/db');
const Settings = require('../models/Settings');

async function seedSettings() {
  try {
    await sequelize.sync();
    
    const existingSettings = await Settings.findOne();
    
    if (existingSettings) {
      console.log('Settings already exist. Skipping seed.');
      process.exit(0);
    }

    await Settings.create({
      contactEmail: 'support@aureva.com',
      salesEmail: 'sales@aureva.com',
      phone: '+1 (555) 123-4567',
      address: '123 Beauty Avenue, New York, NY 10001',
      facebookUrl: 'https://facebook.com/aureva',
      instagramUrl: 'https://instagram.com/aureva',
      twitterUrl: 'https://twitter.com/aureva',
      youtubeUrl: 'https://youtube.com/aureva'
    });

    console.log('✅ Settings seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding settings:', error);
    process.exit(1);
  }
}

seedSettings();
