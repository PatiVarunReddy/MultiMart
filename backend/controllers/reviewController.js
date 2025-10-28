const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');
const fs = require('fs').promises;
const path = require('path');

// @desc    Get product reviews
// @route   GET /api/reviews/product/:productId
// @access  Public
exports.getProductReviews = async (req, res) => {
  try {
    // Only show approved reviews to public
    const reviews = await Review.find({ 
      product: req.params.productId,
      status: 'approved'
    })
      .populate('user', 'name avatar')
      .sort('-createdAt');

    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create review
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res) => {
  try {
    const { product, rating, comment } = req.body;

    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({
      user: req.user._id,
      product
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    // Check if user has purchased the product
    const hasOrdered = await Order.exists({
      user: req.user._id,
      'orderItems.product': product,
      orderStatus: 'delivered'
    });

    // Process uploaded images
    const images = req.files ? req.files.map(file => {
      // Convert Windows path to URL format
      const relativePath = path.relative(path.join(__dirname, '..'), file.path);
      return `/uploads/${relativePath.split(path.sep).join('/')}`;
    }) : [];

    const review = await Review.create({
      user: req.user._id,
      product,
      rating,
      comment,
      images,
      isVerifiedPurchase: !!hasOrdered,
      status: 'pending' // Reviews start as pending
    });

    // Don't update product rating for pending reviews
    // Rating will be updated when admin approves

    // Populate user details before sending response
    await review.populate('user', 'name avatar');

    res.status(201).json({ 
      success: true, 
      data: review,
      message: 'Review submitted successfully. It will be visible after admin approval.'
    });
  } catch (error) {
    // Clean up uploaded files if review creation fails
    if (req.files) {
      for (const file of req.files) {
        await fs.unlink(file.path).catch(() => {});
      }
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const productId = review.product;

    // Delete associated images
    if (review.images && review.images.length > 0) {
      for (const imagePath of review.images) {
        const fullPath = path.join(__dirname, '..', imagePath);
        await fs.unlink(fullPath).catch(() => {});
      }
    }

    await review.deleteOne();
    
    // Update product rating
    const reviews = await Review.find({ product: productId });
    const avgRating = reviews.length > 0 
      ? reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length 
      : 0;
    
    await Product.findByIdAndUpdate(productId, {
      rating: avgRating,
      numReviews: reviews.length
    });

    res.json({ success: true, message: 'Review removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark review as helpful
// @route   POST /api/reviews/:id/helpful
// @access  Private
exports.markReviewHelpful = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Increment helpful count
    review.helpfulCount += 1;
    await review.save();

    res.json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};