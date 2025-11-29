import { useState, useEffect } from 'react';
import { studentsAPI, attendanceAPI } from '../utils/api.js';
import FaceRecognition from '../components/FaceRecognition.jsx';

export default function Attendance() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});
  const [error, setError] = useState('');
  const [showFaceRecognition, setShowFaceRecognition] = useState(false);

  useEffect(() => {
    fetchStudents();
    fetchTodayAttendance();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await studentsAPI.getAll();
      setStudents(response.data.filter((s) => s.status === 'active'));
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const fetchTodayAttendance = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await attendanceAPI.getAll({ date: today });
      const todayAttendance = {};
      
      if (response && response.data && Array.isArray(response.data)) {
        response.data.forEach((a) => {
          // Handle both populated and non-populated student references
          const studentId = a.student?._id || a.student || a.studentId;
          if (studentId && a.status) {
            todayAttendance[studentId] = a.status;
          }
        });
      }
      
      console.log('Fetched attendance:', todayAttendance);
      // Force state update with new object reference
      setAttendance(todayAttendance);
    } catch (err) {
      console.error('Failed to load today attendance:', err);
      // On error, set empty object so all students default to 'absent'
      setAttendance({});
    }
  };

  const markAttendance = async (studentId, status) => {
    try {
      setSaving((prev) => ({ ...prev, [studentId]: true }));
      const response = await attendanceAPI.mark({
        student: studentId,
        status,
        date: new Date().toISOString().split('T')[0],
      });
      
      // Update local state immediately
      setAttendance((prev) => ({ ...prev, [studentId]: status }));
      
      // Also refresh from server to ensure consistency
      await fetchTodayAttendance();
      
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setSaving((prev) => ({ ...prev, [studentId]: false }));
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="mb-2 text-2xl font-semibold text-slate-900">
          Mark Attendance
        </h1>
        <p className="text-sm text-slate-500">Loading students...</p>
      </div>
    );
  }

  const handleAttendanceMarked = async (studentId) => {
    // Immediately update local state to 'present' for the recognized student
    if (studentId) {
      setAttendance((prev) => ({
        ...prev,
        [studentId]: 'present',
      }));
      console.log('Updated local state for student:', studentId);
    }
    
    // Small delay to ensure backend has processed the request
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Refresh attendance data from server to ensure consistency
    await fetchTodayAttendance();
    
    // Also refresh students list
    await fetchStudents();
    
    // Trigger a custom event to notify dashboard
    window.dispatchEvent(new CustomEvent('attendanceUpdated'));
    
    console.log('Attendance marked callback completed');
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-2xl font-semibold text-slate-900">
            Mark Attendance
          </h1>
          <p className="text-sm text-slate-500">
            Mark attendance for today: {new Date().toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={() => setShowFaceRecognition(true)}
          className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          📷 Facial Recognition
        </button>
      </div>
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}
      {students.length === 0 ? (
        <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
          <p className="text-slate-500">No active students found.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2 font-medium text-slate-600">Student ID</th>
                <th className="px-4 py-2 font-medium text-slate-600">Name</th>
                <th className="px-4 py-2 font-medium text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => {
                const currentStatus = attendance[s._id] || 'absent';
                return (
                  <tr key={s._id} className="border-t">
                    <td className="px-4 py-2">{s.studentId}</td>
                    <td className="px-4 py-2">{s.name}</td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => markAttendance(s._id, 'present')}
                          disabled={saving[s._id]}
                          className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                            currentStatus === 'present'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                          } disabled:opacity-50`}
                        >
                          Present
                        </button>
                        <button
                          onClick={() => markAttendance(s._id, 'absent')}
                          disabled={saving[s._id]}
                          className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                            currentStatus === 'absent'
                              ? 'bg-red-600 text-white'
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          } disabled:opacity-50`}
                        >
                          Absent
                        </button>
                        <button
                          onClick={() => markAttendance(s._id, 'late')}
                          disabled={saving[s._id]}
                          className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                            currentStatus === 'late'
                              ? 'bg-yellow-600 text-white'
                              : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                          } disabled:opacity-50`}
                        >
                          Late
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showFaceRecognition && (
        <FaceRecognition
          onAttendanceMarked={handleAttendanceMarked}
          onClose={() => setShowFaceRecognition(false)}
        />
      )}
    </div>
  );
}
