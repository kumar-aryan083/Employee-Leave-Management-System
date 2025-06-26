import express from 'express';
import { protect, isManager } from '../middleware/authMiddleware.js';
import {
  submitLeaveRequest,
  getMyLeaveRequests,
  getPendingLeaves, approveOrRejectLeave
} from '../controllers/leaveController.js';

const router = express.Router();

router.post('/request', protect, submitLeaveRequest);
router.get('/my-requests', protect, getMyLeaveRequests);
router.get('/pending', protect, isManager, getPendingLeaves);
router.patch('/:id/approve', protect, isManager, approveOrRejectLeave);

export default router;
