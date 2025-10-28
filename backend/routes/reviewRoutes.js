import express from 'express';
const router = express.Router();
import {
  getProductReviews,
  createReview,
  deleteReview,
  markReviewHelpful
} from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

// Routes with file upload
router.post('/', protect, upload.array('images', 5), createReview);

// Other routes
router.get('/product/:productId', getProductReviews);
router.delete('/:id', protect, deleteReview);
router.post('/:id/helpful', protect, markReviewHelpful);

export default router;
