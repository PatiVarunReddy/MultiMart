const express = require('express');
const router = express.Router();
const { getUsers, updateProfile, deleteUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('admin'), getUsers);
router.put('/profile', protect, updateProfile);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
