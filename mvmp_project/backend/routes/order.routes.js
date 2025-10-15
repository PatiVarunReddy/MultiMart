const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/order.controller');
router.post('/', ctrl.createOrder);
router.get('/:userId', ctrl.getOrdersByUser);
router.get('/vendor/:vendorId', ctrl.getOrdersByVendor);
module.exports = router;
