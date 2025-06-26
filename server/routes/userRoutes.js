import express from 'express';
import { protect, isManager } from '../middleware/authMiddleware.js';
import { getLeaveBalance, resetLeaveBalance } from '../controllers/userController.js';

const router = express.Router();

router.get('/leave-balance', protect, getLeaveBalance);
router.patch('/reset-leave', protect, isManager, resetLeaveBalance);

export default router;
