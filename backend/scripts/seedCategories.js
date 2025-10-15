require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/Category');

const categories = [
  { name: 'Electronics', description: 'Electronic devices and gadgets', slug: 'electronics' },
  { name: 'Fashion', description: 'Clothing, shoes, and accessories', slug: 'fashion' },
  { name: 'Home & Kitchen', description: 'Home appliances and kitchen items', slug: 'home-kitchen' },
  { name: 'Books', description: 'Books and educational materials', slug: 'books' },
  { name: 'Sports', description: 'Sports and fitness equipment', slug: 'sports' },
  { name: 'Beauty', description: 'Beauty and personal care products', slug: 'beauty' },
  { name: 'Toys', description: 'Toys and games for kids', slug: 'toys' },
  { name: 'Automotive', description: 'Automotive parts and accessories', slug: 'automotive' }
];

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('[SUCCESS] Connected to MongoDB');
    
    // Drop the collection to remove unique index issues
    try {
      await mongoose.connection.db.dropCollection('categories');
      console.log('[INFO] Dropped existing categories collection');
    } catch (err) {
      console.log('[INFO] Categories collection does not exist yet');
    }
    
    // Insert new categories
    const result = await Category.insertMany(categories);
    console.log(`[SUCCESS] Added ${result.length} categories to database`);
    
    console.log('\n[CATEGORIES LIST]:');
    result.forEach(cat => {
      console.log(`   - ${cat.name} (ID: ${cat._id})`);
    });
    
    console.log('\n[COMPLETE] Categories seeded successfully!');
    console.log('[INFO] Categories are now available for product creation.\n');
    
    process.exit(0);
  })
  .catch(err => {
    console.error('[ERROR] Database connection failed:', err.message);
    process.exit(1);
  });
