import express from 'express';
const router = express.Router();
import {
  getDashboardStats,
  getPendingReviews,
  getAllReviews,
  approveReview,
  rejectReview,
  deleteReview
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

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

export default router;
