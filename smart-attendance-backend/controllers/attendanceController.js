import Attendance from '../models/Attendance.js';
import Student from '../models/Student.js';
import { sendAttendanceEmail } from '../utils/emailService.js';

// @desc    Mark attendance
// @route   POST /api/attendance
// @access  Private
export const markAttendance = async (req, res) => {
  try {
    const { student, date, status, remarks } = req.body;

    if (!student || !status) {
      return res.status(400).json({ message: 'Please provide student and status' });
    }

    // Use provided date or today's date
    const attendanceDate = date ? new Date(date) : new Date();
    attendanceDate.setHours(0, 0, 0, 0);

    // Check if attendance already marked for this date
    const existing = await Attendance.findOne({
      student,
      date: attendanceDate,
    });

    // Get student details for email
    const studentData = await Student.findById(student);
    
    if (!studentData) {
      return res.status(404).json({ message: 'Student not found' });
    }

    let attendance;

    if (existing) {
      // Update existing attendance
      existing.status = status;
      existing.remarks = remarks || existing.remarks;
      existing.markedBy = req.user._id;
      attendance = await existing.save();
    } else {
      // Create new attendance
      attendance = await Attendance.create({
        student,
        date: attendanceDate,
        status,
        remarks,
        markedBy: req.user._id,
      });
    }

    // Send email notification (don't wait for it to complete)
    sendAttendanceEmail({
      studentEmail: studentData.email,
      studentName: studentData.name,
      status: status,
      date: attendanceDate,
      studentId: studentData.studentId,
    }).catch((emailError) => {
      // Log error but don't fail the request
      console.error('Failed to send attendance email:', emailError);
    });

    // Return attendance record
    if (existing) {
      return res.json(attendance);
    } else {
      return res.status(201).json(attendance);
    }
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Attendance already marked for this date' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

// @desc    Get all attendance records
// @route   GET /api/attendance
// @access  Private
export const getAttendance = async (req, res) => {
  try {
    const { student, date, startDate, endDate } = req.query;

    let query = {};

    if (student) {
      query.student = student;
    }

    if (date) {
      const attendanceDate = new Date(date);
      attendanceDate.setHours(0, 0, 0, 0);
      query.date = attendanceDate;
    }

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const attendance = await Attendance.find(query)
      .populate('student', 'studentId name email')
      .populate('markedBy', 'name email')
      .sort({ date: -1, createdAt: -1 });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get attendance by student
// @route   GET /api/attendance/student/:studentId
// @access  Private
export const getAttendanceByStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const { startDate, endDate } = req.query;

    let query = { student: req.params.studentId };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const attendance = await Attendance.find(query)
      .populate('markedBy', 'name email')
      .sort({ date: -1 });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get attendance statistics
// @route   GET /api/attendance/stats
// @access  Private
export const getAttendanceStats = async (req, res) => {
  try {
    const { student, startDate, endDate } = req.query;

    let query = {};

    if (student) {
      query.student = student;
    }

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const total = await Attendance.countDocuments(query);
    const present = await Attendance.countDocuments({ ...query, status: 'present' });
    const absent = await Attendance.countDocuments({ ...query, status: 'absent' });
    const late = await Attendance.countDocuments({ ...query, status: 'late' });

    res.json({
      total,
      present,
      absent,
      late,
      presentPercentage: total > 0 ? ((present / total) * 100).toFixed(2) : 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update attendance
// @route   PUT /api/attendance/:id
// @access  Private
export const updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    const updated = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('student', 'studentId name email')
      .populate('markedBy', 'name email');

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete attendance
// @route   DELETE /api/attendance/:id
// @access  Private
export const deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    await attendance.deleteOne();
    res.json({ message: 'Attendance record removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

