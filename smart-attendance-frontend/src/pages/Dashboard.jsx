import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { attendanceAPI, studentsAPI } from '../utils/api.js';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    todayPresent: 0,
    todayAbsent: 0,
    todayLate: 0,
    todayRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];

      // Fetch students count
      const studentsRes = await studentsAPI.getAll();
      const totalStudents = studentsRes.data.filter((s) => s.status === 'active')
        .length;

      // Fetch today's attendance stats
      const statsRes = await attendanceAPI.getStats({ date: today });
      const todayPresent = statsRes.data.present || 0;
      const todayAbsent = statsRes.data.absent || 0;
      const todayLate = statsRes.data.late || 0;
      const total = todayPresent + todayAbsent + todayLate;
      const todayRate = total > 0 ? ((todayPresent / total) * 100).toFixed(1) : 0;

      setStats({
        totalStudents,
        todayPresent,
        todayAbsent,
        todayLate,
        todayRate,
      });
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold text-slate-900">Dashboard</h1>
      <p className="mb-4 text-sm text-slate-500">
        Welcome back, {user?.name || 'User'}.
      </p>
      {loading ? (
        <p className="text-sm text-slate-500">Loading statistics...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500">Today&apos;s Rate</p>
            <p className="mt-2 text-2xl font-semibold text-emerald-600">
              {stats.todayRate}%
            </p>
          </div>
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500">Present</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {stats.todayPresent}
            </p>
          </div>
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500">Absent</p>
            <p className="mt-2 text-2xl font-semibold text-red-500">
              {stats.todayAbsent}
            </p>
          </div>
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500">Late</p>
            <p className="mt-2 text-2xl font-semibold text-yellow-600">
              {stats.todayLate}
            </p>
          </div>
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500">Total Students</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {stats.totalStudents}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
