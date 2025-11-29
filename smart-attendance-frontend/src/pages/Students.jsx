import { useState, useEffect } from 'react';
import { studentsAPI } from '../utils/api.js';
import FaceRegistration from '../components/FaceRegistration.jsx';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showFaceRegistration, setShowFaceRegistration] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    email: '',
    phone: '',
    course: '',
    semester: '',
    status: 'active',
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await studentsAPI.getAll();
      setStudents(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await studentsAPI.create(formData);
      const newStudent = response.data;
      setFormData({
        studentId: '',
        name: '',
        email: '',
        phone: '',
        course: '',
        semester: '',
        status: 'active',
      });
      setShowForm(false);
      fetchStudents(); // Refresh the list
      
      // Prompt to register face
      if (confirm('Student added! Would you like to register their face for facial recognition?')) {
        setSelectedStudentId(newStudent._id);
        setShowFaceRegistration(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add student');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFaceCaptured = async (faceEncoding) => {
    try {
      if (selectedStudentId) {
        await studentsAPI.update(selectedStudentId, { faceEncoding });
        setShowFaceRegistration(false);
        setSelectedStudentId(null);
        fetchStudents(); // Refresh to show face registered
        alert('Face registered successfully!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register face');
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="mb-2 text-2xl font-semibold text-slate-900">Students</h1>
        <p className="text-sm text-slate-500">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-2xl font-semibold text-slate-900">Students</h1>
          <p className="text-sm text-slate-500">
            Manage student information and records.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : '+ Add Student'}
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Add Student Form */}
      {showForm && (
        <div className="mb-6 rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Add New Student</h2>
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Student ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="studentId"
                required
                value={formData.studentId}
                onChange={handleChange}
                className="w-full rounded-md border px-3 py-2 text-sm outline-none ring-slate-200 focus:ring-2"
                placeholder="STU001"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-md border px-3 py-2 text-sm outline-none ring-slate-200 focus:ring-2"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-md border px-3 py-2 text-sm outline-none ring-slate-200 focus:ring-2"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-md border px-3 py-2 text-sm outline-none ring-slate-200 focus:ring-2"
                placeholder="+1234567890"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Course
              </label>
              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
                className="w-full rounded-md border px-3 py-2 text-sm outline-none ring-slate-200 focus:ring-2"
              >
                <option value="">Select Course</option>
                <option value="CSE">CSE</option>
                <option value="CSM">CSM</option>
                <option value="CSD">CSD</option>
                <option value="MECH">MECH</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="CIVIL">CIVIL</option>
                <option value="IT">IT</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Semester
              </label>
              <input
                type="text"
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className="w-full rounded-md border px-3 py-2 text-sm outline-none ring-slate-200 focus:ring-2"
                placeholder="Fall 2024"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-md border px-3 py-2 text-sm outline-none ring-slate-200 focus:ring-2"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? 'Adding...' : 'Add Student'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Students Table */}
      {loading ? (
        <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
          <p className="text-slate-500">Loading students...</p>
        </div>
      ) : students.length === 0 ? (
        <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
          <p className="text-slate-500">No students found. Add your first student!</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2 font-medium text-slate-600">Student ID</th>
                <th className="px-4 py-2 font-medium text-slate-600">Name</th>
                <th className="px-4 py-2 font-medium text-slate-600">Email</th>
                <th className="px-4 py-2 font-medium text-slate-600">Phone</th>
                <th className="px-4 py-2 font-medium text-slate-600">Course</th>
                <th className="px-4 py-2 font-medium text-slate-600">Semester</th>
                <th className="px-4 py-2 font-medium text-slate-600">Status</th>
                <th className="px-4 py-2 font-medium text-slate-600">Face</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s._id} className="border-t">
                  <td className="px-4 py-2">{s.studentId}</td>
                  <td className="px-4 py-2">{s.name}</td>
                  <td className="px-4 py-2">{s.email}</td>
                  <td className="px-4 py-2">{s.phone || '-'}</td>
                  <td className="px-4 py-2">{s.course || '-'}</td>
                  <td className="px-4 py-2">{s.semester || '-'}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        s.status === 'active'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {s.status || 'active'}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {s.faceEncoding && s.faceEncoding.length > 0 ? (
                      <span className="text-xs text-emerald-600">✓ Registered</span>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedStudentId(s._id);
                          setShowFaceRegistration(true);
                        }}
                        className="rounded-md bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-700"
                      >
                        Register Face
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showFaceRegistration && (
        <FaceRegistration
          onFaceCaptured={handleFaceCaptured}
          onClose={() => {
            setShowFaceRegistration(false);
            setSelectedStudentId(null);
          }}
        />
      )}
    </div>
  );
}
