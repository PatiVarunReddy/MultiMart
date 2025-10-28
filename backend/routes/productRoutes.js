import express from 'express';
const router = express.Router();
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getVendorProducts,
  getMyProducts
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/auth.js';

router.route('/')
  .get(getProducts)
  .post(protect, authorize('vendor', 'admin'), createProduct);

router.get('/my-products', protect, authorize('vendor', 'admin'), getMyProducts);

router.route('/:id')
  .get(getProduct)
  .put(protect, authorize('vendor', 'admin'), updateProduct)
  .delete(protect, authorize('vendor', 'admin'), deleteProduct);

router.get('/vendor/:vendorId', getVendorProducts);

export default router;
