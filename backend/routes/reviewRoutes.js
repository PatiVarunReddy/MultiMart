const express = require('express');
const router = express.Router();
const {
  getProductReviews,
  createReview,
  deleteReview
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createReview);
router.get('/product/:productId', getProductReviews);
router.delete('/:id', protect, deleteReview);

module.exports = router;
