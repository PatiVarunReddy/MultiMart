import express from 'express';
const router = express.Router();
import {
  getMyInventory,
  getBrowseProducts,
  sourceProduct,
  updateInventory,
  deleteInventory,
  getInventoryAnalytics
} from '../controllers/inventoryController.js';
import { protect, authorize } from '../middleware/auth.js';

// All routes require authentication and vendor role
router.use(protect);
router.use(authorize('vendor'));

router.get('/my-inventory', getMyInventory);
router.get('/browse', getBrowseProducts);
router.post('/source', sourceProduct);
router.get('/analytics', getInventoryAnalytics);
router.put('/:id', updateInventory);
router.delete('/:id', deleteInventory);

export default router;
