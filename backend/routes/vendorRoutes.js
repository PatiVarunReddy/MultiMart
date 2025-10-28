import express from 'express';
const router = express.Router();
import {
  getVendors,
  getVendor,
  updateVendor,
  approveVendor
} from '../controllers/vendorController.js';
import { protect, authorize } from '../middleware/auth.js';

router.get('/', getVendors);
router.get('/:id', getVendor);
router.put('/:id', protect, authorize('vendor', 'admin'), updateVendor);
router.put('/:id/approve', protect, authorize('admin'), approveVendor);

export default router;
