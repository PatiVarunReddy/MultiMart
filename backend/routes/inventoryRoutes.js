const express = require('express');
const router = express.Router();
const {
  getMyInventory,
  getBrowseProducts,
  sourceProduct,
  updateInventory,
  deleteInventory,
  getInventoryAnalytics
} = require('../controllers/inventoryController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication and vendor role
router.use(protect);
router.use(authorize('vendor'));

router.get('/my-inventory', getMyInventory);
router.get('/browse', getBrowseProducts);
router.post('/source', sourceProduct);
router.get('/analytics', getInventoryAnalytics);
router.put('/:id', updateInventory);
router.delete('/:id', deleteInventory);

module.exports = router;
