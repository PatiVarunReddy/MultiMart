const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/auth.controller');
router.post('/signup', ctrl.signup);
router.post('/login', ctrl.login);
router.post('/forgot', ctrl.requestOtp);
router.post('/verify-otp', ctrl.verifyOtp);
router.post('/reset-password', ctrl.resetPassword);
module.exports = router;
