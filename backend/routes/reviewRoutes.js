const express = require('express');
const router = express.Router();
const {
  getProductReviews,
  createReview,
  deleteReview,
  markReviewHelpful
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Routes with file upload
router.post('/', protect, upload.array('images', 5), createReview);

// Other routes
router.get('/product/:productId', getProductReviews);
router.delete('/:id', protect, deleteReview);
router.post('/:id/helpful', protect, markReviewHelpful);

module.exports = router;
