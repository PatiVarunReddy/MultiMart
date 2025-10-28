const Review = require('../models/Review');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      pendingReviews,
      approvedReviews,
      rejectedReviews,
      recentOrders,
      recentUsers
    ] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Review.countDocuments({ status: 'pending' }),
      Review.countDocuments({ status: 'approved' }),
      Review.countDocuments({ status: 'rejected' }),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email'),
      User.find().sort({ createdAt: -1 }).limit(5).select('name email role createdAt')
    ]);

    // Calculate revenue
    const orders = await Order.find({ status: { $in: ['delivered', 'completed'] } });
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalProducts,
          totalOrders,
          totalRevenue,
          pendingReviews,
          approvedReviews,
          rejectedReviews
        },
        recentOrders,
        recentUsers
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all pending reviews
// @route   GET /api/admin/reviews/pending
// @access  Private/Admin
exports.getPendingReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ status: 'pending' })
      .populate('user', 'name email')
      .populate('product', 'name images')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all reviews with filters
// @route   GET /api/admin/reviews
// @access  Private/Admin
exports.getAllReviews = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      Review.find(query)
        .populate('user', 'name email')
        .populate('product', 'name images')
        .populate('approvedBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Review.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: reviews,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Approve a review
// @route   PUT /api/admin/reviews/:id/approve
// @access  Private/Admin
exports.approveReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    review.status = 'approved';
    review.approvedBy = req.user._id;
    review.approvedAt = new Date();
    await review.save();

    // Update product rating
    await updateProductRating(review.product);

    const updatedReview = await Review.findById(review._id)
      .populate('user', 'name email')
      .populate('product', 'name images')
      .populate('approvedBy', 'name email');

    res.json({
      success: true,
      message: 'Review approved successfully',
      data: updatedReview
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Reject a review
// @route   PUT /api/admin/reviews/:id/reject
// @access  Private/Admin
exports.rejectReview = async (req, res) => {
  try {
    const { reason } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    review.status = 'rejected';
    review.approvedBy = req.user._id;
    review.approvedAt = new Date();
    review.rejectionReason = reason || 'Does not meet community guidelines';
    await review.save();

    const updatedReview = await Review.findById(review._id)
      .populate('user', 'name email')
      .populate('product', 'name images')
      .populate('approvedBy', 'name email');

    res.json({
      success: true,
      message: 'Review rejected successfully',
      data: updatedReview
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete a review
// @route   DELETE /api/admin/reviews/:id
// @access  Private/Admin
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    const productId = review.product;
    await review.deleteOne();

    // Update product rating after deletion
    await updateProductRating(productId);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Helper function to update product rating
async function updateProductRating(productId) {
  const approvedReviews = await Review.find({ 
    product: productId, 
    status: 'approved' 
  });

  if (approvedReviews.length > 0) {
    const avgRating = approvedReviews.reduce((sum, review) => sum + review.rating, 0) / approvedReviews.length;
    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(avgRating * 10) / 10,
      numReviews: approvedReviews.length
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      rating: 0,
      numReviews: 0
    });
  }
}

module.exports = exports;
