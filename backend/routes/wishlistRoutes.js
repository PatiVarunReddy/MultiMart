import express from 'express';
const router = express.Router();
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist
} from '../controllers/wishlistController.js';
import { protect } from '../middleware/auth.js';

router.get('/', protect, getWishlist);
router.post('/:productId', protect, addToWishlist);
router.delete('/:productId', protect, removeFromWishlist);

export default router;
                                                                                                  