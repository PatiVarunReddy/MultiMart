const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Vendor = require('../models/Vendor');
const User = require('../models/User');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mvmp');
    console.log('[SUCCESS] Connected to MongoDB database');
  } catch (err) {
    console.error('[ERROR] MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

const seedProducts = async () => {
  try {
    await connectDB();

    // Clear existing products
    await Product.deleteMany({});
    console.log('[INFO] Cleared existing products from database');
    
    // Drop the slug index to avoid conflicts
    try {
      await Product.collection.dropIndex('slug_1');
      console.log('[INFO] Dropped product slug index');
    } catch (err) {
      console.log('[INFO] Slug index does not exist or already dropped');
    }

    // Get categories
    const categories = await Category.find();
    if (categories.length === 0) {
      console.log('[ERROR] No categories found in database');
      console.log('[ACTION REQUIRED] Please run seedCategories.js first!');
      process.exit(1);
    }

    // Get or create a demo vendor
    let demoUser = await User.findOne({ email: 'vendor@demo.com' });
    if (!demoUser) {
      demoUser = await User.create({
        name: 'Demo Vendor',
        email: 'vendor@demo.com',
        password: 'password123',
        role: 'vendor'
      });
    }

    let demoVendor = await Vendor.findOne({ userId: demoUser._id });
    if (!demoVendor) {
      demoVendor = await Vendor.create({
        userId: demoUser._id,
        storeName: 'Demo Store',
        storeDescription: 'Your trusted demo marketplace vendor',
        businessEmail: 'vendor@demo.com',
        businessPhone: '1234567890',
        businessAddress: {
          street: '123 Main St',
          city: 'Demo City',
          state: 'Demo State',
          zipCode: '12345',
          country: 'India'
        },
        isApproved: true,
        isActive: true
      });
      
      // Update user with vendor ID
      demoUser.vendorId = demoVendor._id;
      await demoUser.save();
    }

    // Sample products data
    const sampleProducts = [
      {
        vendor: demoVendor._id,
        name: 'Samsung Galaxy S21 Ultra',
        description: 'Latest Samsung flagship smartphone with stunning 6.8" Dynamic AMOLED display, powerful Exynos processor, and pro-grade camera system.',
        category: categories.find(c => c.name === 'Electronics')?._id || categories[0]._id,
        brand: 'Samsung',
        price: 99999,
        discountPrice: 84999,
        stock: 50,
        images: ['https://images.samsung.com/is/image/samsung/p6pim/in/galaxy-s21/gallery/in-galaxy-s21-ultra-5g-g988-sm-g998bzadinu-368339186'],
        tags: ['smartphone', 'samsung', '5g', 'flagship'],
        rating: 4.5,
        numReviews: 128,
        isApproved: true,
        isActive: true,
        isFeatured: true,
        shippingInfo: {
          freeShipping: true,
          shippingCost: 0
        }
      },
      {
        vendor: demoVendor._id,
        name: 'Apple iPhone 14 Pro',
        description: 'Experience the power of A16 Bionic chip, Always-On display, and Dynamic Island in this premium iPhone.',
        category: categories.find(c => c.name === 'Electronics')?._id || categories[0]._id,
        brand: 'Apple',
        price: 129999,
        discountPrice: 119999,
        stock: 30,
        images: ['https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-14-pro-finish-select-202209-6-7inch-deeppurple'],
        tags: ['iphone', 'apple', 'smartphone', '5g'],
        rating: 4.8,
        numReviews: 256,
        isApproved: true,
        isActive: true,
        isFeatured: true,
        shippingInfo: {
          freeShipping: true,
          shippingCost: 0
        }
      },
      {
        vendor: demoVendor._id,
        name: 'Sony WH-1000XM5 Wireless Headphones',
        description: 'Industry-leading noise canceling with two processors controlling 8 microphones. Premium sound quality with LDAC and DSEE Extreme.',
        category: categories.find(c => c.name === 'Electronics')?._id || categories[0]._id,
        brand: 'Sony',
        price: 29990,
        discountPrice: 24990,
        stock: 100,
        images: ['https://m.media-amazon.com/images/I/51G3pLXHTtL._SX522_.jpg'],
        tags: ['headphones', 'sony', 'wireless', 'noise-canceling'],
        rating: 4.7,
        numReviews: 89,
        isApproved: true,
        isActive: true,
        isFeatured: true,
        shippingInfo: {
          freeShipping: true,
          shippingCost: 0
        }
      },
      {
        vendor: demoVendor._id,
        name: 'Nike Air Max 270',
        description: 'Featuring Nike\'s biggest heel Air unit yet for a super-soft ride that feels as impossible as it looks.',
        category: categories.find(c => c.name === 'Fashion')?._id || categories[1]._id,
        brand: 'Nike',
        price: 12995,
        discountPrice: 9999,
        stock: 75,
        images: ['https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/e777c881-5b62-4250-92a6-362967f54cca/air-max-270-shoes-2V5C4p.png'],
        tags: ['shoes', 'nike', 'sneakers', 'sports'],
        rating: 4.4,
        numReviews: 67,
        isApproved: true,
        isActive: true,
        shippingInfo: {
          freeShipping: false,
          shippingCost: 100
        }
      },
      {
        vendor: demoVendor._id,
        name: 'Levi\'s 501 Original Jeans',
        description: 'The original jean since 1873. A vintage-inspired fit with a straight leg and regular waist.',
        category: categories.find(c => c.name === 'Fashion')?._id || categories[1]._id,
        brand: 'Levi\'s',
        price: 3999,
        discountPrice: 2999,
        stock: 120,
        images: ['https://lsco.scene7.com/is/image/lsco/005010101-front-pdp'],
        tags: ['jeans', 'levis', 'denim', 'clothing'],
        rating: 4.6,
        numReviews: 145,
        isApproved: true,
        isActive: true,
        shippingInfo: {
          freeShipping: false,
          shippingCost: 50
        }
      },
      {
        vendor: demoVendor._id,
        name: 'Modern Living Room Sofa Set',
        description: 'Comfortable 3-seater sofa with premium fabric upholstery and solid wood frame. Perfect for your living room.',
        category: categories.find(c => c.name === 'Home & Garden')?._id || categories[2]._id,
        brand: 'HomeStyle',
        price: 45999,
        discountPrice: 39999,
        stock: 15,
        images: ['https://ii1.pepperfry.com/media/catalog/product/m/o/568x625/modern-fabric-3-seater-sofa-in-grey-colour-by-furnitech-modern-fabric-3-seater-sofa-in-grey-colour--wflfmh.jpg'],
        tags: ['furniture', 'sofa', 'living room', 'home decor'],
        rating: 4.3,
        numReviews: 34,
        isApproved: true,
        isActive: true,
        shippingInfo: {
          freeShipping: true,
          shippingCost: 0
        }
      },
      {
        vendor: demoVendor._id,
        name: 'Organic Green Tea - 100g',
        description: 'Premium organic green tea leaves sourced from Darjeeling. Rich in antioxidants and natural flavor.',
        category: categories.find(c => c.name === 'Food & Beverages')?._id || categories[3]._id,
        brand: 'TeaTime',
        price: 499,
        discountPrice: 399,
        stock: 200,
        images: ['https://m.media-amazon.com/images/I/71kXcLWLjPL._SX679_.jpg'],
        tags: ['tea', 'organic', 'green tea', 'beverage'],
        rating: 4.5,
        numReviews: 78,
        isApproved: true,
        isActive: true,
        shippingInfo: {
          freeShipping: false,
          shippingCost: 40
        }
      },
      {
        vendor: demoVendor._id,
        name: 'Yoga Mat with Carrying Strap',
        description: 'Non-slip, eco-friendly yoga mat made from TPE material. Perfect for yoga, pilates, and fitness exercises.',
        category: categories.find(c => c.name === 'Sports & Outdoors')?._id || categories[4]._id,
        brand: 'FitPro',
        price: 1999,
        discountPrice: 1499,
        stock: 85,
        images: ['https://m.media-amazon.com/images/I/71pXC-P9qnL._SX679_.jpg'],
        tags: ['yoga', 'fitness', 'exercise', 'mat'],
        rating: 4.4,
        numReviews: 92,
        isApproved: true,
        isActive: true,
        shippingInfo: {
          freeShipping: false,
          shippingCost: 50
        }
      },
      {
        vendor: demoVendor._id,
        name: 'Dell XPS 15 Laptop',
        description: '15.6" FHD display, Intel Core i7 processor, 16GB RAM, 512GB SSD. Perfect for professionals and creators.',
        category: categories.find(c => c.name === 'Electronics')?._id || categories[0]._id,
        brand: 'Dell',
        price: 125999,
        discountPrice: 115999,
        stock: 20,
        images: ['https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-15-9520/media-gallery/notebook-xps-15-9520-nt-blue-gallery-4.psd'],
        tags: ['laptop', 'dell', 'computer', 'professional'],
        rating: 4.6,
        numReviews: 54,
        isApproved: true,
        isActive: true,
        isFeatured: true,
        shippingInfo: {
          freeShipping: true,
          shippingCost: 0
        }
      },
      {
        vendor: demoVendor._id,
        name: 'Skincare Vitamin C Serum',
        description: 'Brightening serum with 20% Vitamin C. Reduces dark spots and improves skin radiance.',
        category: categories.find(c => c.name === 'Beauty & Health')?._id || categories[5]._id,
        brand: 'GlowSkin',
        price: 1299,
        discountPrice: 999,
        stock: 150,
        images: ['https://m.media-amazon.com/images/I/51Q5rZXsM3L._SX679_.jpg'],
        tags: ['skincare', 'serum', 'vitamin c', 'beauty'],
        rating: 4.7,
        numReviews: 234,
        isApproved: true,
        isActive: true,
        shippingInfo: {
          freeShipping: false,
          shippingCost: 40
        }
      },
      {
        vendor: demoVendor._id,
        name: 'Building Blocks Set - 500 Pieces',
        description: 'Colorful building blocks set for kids. Encourages creativity and motor skills development.',
        category: categories.find(c => c.name === 'Toys & Games')?._id || categories[6]._id,
        brand: 'PlayTime',
        price: 1999,
        discountPrice: 1599,
        stock: 95,
        images: ['https://m.media-amazon.com/images/I/81xLD-yBjTL._SX679_.jpg'],
        tags: ['toys', 'kids', 'building blocks', 'educational'],
        rating: 4.5,
        numReviews: 112,
        isApproved: true,
        isActive: true,
        shippingInfo: {
          freeShipping: false,
          shippingCost: 50
        }
      },
      {
        vendor: demoVendor._id,
        name: 'Professional Camera Tripod',
        description: 'Lightweight aluminum tripod with 360° rotation head. Supports cameras up to 5kg.',
        category: categories.find(c => c.name === 'Electronics')?._id || categories[0]._id,
        brand: 'ProGear',
        price: 2499,
        discountPrice: 1999,
        stock: 60,
        images: ['https://m.media-amazon.com/images/I/61JWxKvxZIL._SX679_.jpg'],
        tags: ['tripod', 'camera', 'photography', 'accessories'],
        rating: 4.3,
        numReviews: 45,
        isApproved: true,
        isActive: true,
        shippingInfo: {
          freeShipping: false,
          shippingCost: 60
        }
      }
    ];

    // Insert products one by one to trigger pre-save hooks for slug generation
    const products = [];
    for (const productData of sampleProducts) {
      const product = await Product.create(productData);
      products.push(product);
    }
    
    console.log(`[SUCCESS] ${products.length} products seeded successfully!`);

    console.log('\n========================================');
    console.log('         PRODUCTS SEEDED SUMMARY        ');
    console.log('========================================');
    console.log(`Vendor Store:  ${demoVendor.storeName}`);
    console.log(`Email:         ${demoUser.email}`);
    console.log(`Password:      password123`);
    console.log(`Total Products: ${products.length}`);
    console.log(`Status:        All products approved & active`);
    console.log('========================================\n');

    process.exit(0);
  } catch (err) {
    console.error('[ERROR] Failed to seed products:', err);
    process.exit(1);
  }
};

seedProducts();
