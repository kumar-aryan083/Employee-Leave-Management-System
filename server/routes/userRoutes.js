import express from 'express';
import { protect, isManager } from '../middleware/authMiddleware.js';
import { getLeaveBalance, resetLeaveBalance, getAllManagers } from '../controllers/userController.js';

const router = express.Router();

router.get('/leave-balance', protect, getLeaveBalance);
router.patch('/reset-leave', protect, isManager, resetLeaveBalance);
router.get('/managers', getAllManagers);

export default router;
