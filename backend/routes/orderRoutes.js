import express from 'express';
const router = express.Router();
import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  getVendorOrders
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';

router.route('/')
  .post(protect, createOrder)
  .get(protect, authorize('admin'), getAllOrders);

router.get('/myorders', protect, getMyOrders);
router.get('/vendor/orders', protect, authorize('vendor'), getVendorOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, authorize('vendor', 'admin'), updateOrderStatus);

export default router;
