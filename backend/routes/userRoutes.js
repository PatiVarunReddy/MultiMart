import express from 'express';
const router = express.Router();
import { getUsers, updateProfile, deleteUser } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

router.get('/', protect, authorize('admin'), getUsers);
router.put('/profile', protect, updateProfile);
router.delete('/:id', protect, authorize('admin'), deleteUser);

export default router;
