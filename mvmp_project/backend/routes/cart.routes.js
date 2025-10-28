const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/cart.controller');
router.get('/:userId', ctrl.getCart);
router.post('/:userId', ctrl.updateCart);
router.delete('/:userId', ctrl.clearCart);
module.exports = router;
