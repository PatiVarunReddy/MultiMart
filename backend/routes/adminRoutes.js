const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getPendingReviews,
  getAllReviews,
  approveReview,
  rejectReview,
  deleteReview
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and require admin role
router.use(protect, authorize('admin'));

// Dashboard stats
router.get('/stats', getDashboardStats);

// Review management
router.get('/reviews/pending', getPendingReviews);
router.get('/reviews', getAllReviews);
router.put('/reviews/:id/approve', approveReview);
router.put('/reviews/:id/reject', rejectReview);
router.delete('/reviews/:id', deleteReview);

module.exports = router;
