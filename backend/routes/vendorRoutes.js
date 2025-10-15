const express = require('express');
const router = express.Router();
const {
  getVendors,
  getVendor,
  updateVendor,
  approveVendor
} = require('../controllers/vendorController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getVendors);
router.get('/:id', getVendor);
router.put('/:id', protect, authorize('vendor', 'admin'), updateVendor);
router.put('/:id/approve', protect, authorize('admin'), approveVendor);

module.exports = router;
