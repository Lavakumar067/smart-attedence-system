import express from 'express';
import {
  markAttendance,
  getAttendance,
  getAttendanceByStudent,
  getAttendanceStats,
  updateAttendance,
  deleteAttendance,
} from '../controllers/attendanceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getAttendance).post(protect, markAttendance);
router.get('/stats', protect, getAttendanceStats);
router.get('/student/:studentId', protect, getAttendanceByStudent);
router
  .route('/:id')
  .put(protect, updateAttendance)
  .delete(protect, deleteAttendance);

export default router;

