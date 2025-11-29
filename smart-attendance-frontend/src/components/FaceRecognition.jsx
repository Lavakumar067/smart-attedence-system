import { useRef, useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import { studentsAPI, attendanceAPI } from '../utils/api.js';

export default function FaceRecognition({ onAttendanceMarked, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [students, setStudents] = useState([]);
  const [recognizedStudent, setRecognizedStudent] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadModels();
    loadStudents();
    startCamera();

    return () => {
      stopCamera();
    };
  }, []);

  const loadModels = async () => {
    try {
      setLoading(true);
      const MODEL_URL = '/models';
      
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]);
      
      setModelsLoaded(true);
      setLoading(false);
    } catch (err) {
      console.error('Error loading models:', err);
      setError('Failed to load face recognition models.');
      setLoading(false);
    }
  };

  const loadStudents = async () => {
    try {
      const response = await studentsAPI.getAll();
      const activeStudents = response.data.filter(
        (s) => s.status === 'active' && s.faceEncoding && s.faceEncoding.length > 0
      );
      setStudents(activeStudents);
    } catch (err) {
      console.error('Error loading students:', err);
      setError('Failed to load students with registered faces.');
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Failed to access camera. Please allow camera permissions.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
  };

  const recognizeFace = async () => {
    if (!modelsLoaded || !videoRef.current || students.length === 0) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!canvas) return;

    const displaySize = { width: video.videoWidth, height: video.videoHeight };
    faceapi.matchDimensions(canvas, displaySize);

    const detection = await faceapi
      .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (detection) {
      const detectedDescriptor = new Float32Array(detection.descriptor);
      
      // Compare with all registered students
      let bestMatch = null;
      let bestDistance = Infinity;
      const threshold = 0.6; // Face recognition threshold

      students.forEach((student) => {
        if (student.faceEncoding && student.faceEncoding.length > 0) {
          const studentDescriptor = new Float32Array(student.faceEncoding);
          const distance = faceapi.euclideanDistance(detectedDescriptor, studentDescriptor);
          
          if (distance < threshold && distance < bestDistance) {
            bestDistance = distance;
            bestMatch = student;
          }
        }
      });

      if (bestMatch) {
        setRecognizedStudent(bestMatch);
        setScanning(false);
        markAttendance(bestMatch._id);
      } else {
        setRecognizedStudent(null);
      }

      const resizedDetection = faceapi.resizeResults(detection, displaySize);
      faceapi.draw.drawDetections(canvas, resizedDetection);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetection);
    } else {
      setRecognizedStudent(null);
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    if (scanning) {
      requestAnimationFrame(recognizeFace);
    }
  };

  const startScanning = () => {
    setScanning(true);
    setError('');
    setSuccess('');
    setRecognizedStudent(null);
    recognizeFace();
  };

  const stopScanning = () => {
    setScanning(false);
  };

  const markAttendance = async (studentId) => {
    try {
      await attendanceAPI.mark({
        student: studentId,
        status: 'present',
        date: new Date().toISOString().split('T')[0],
      });
      setSuccess('Attendance marked successfully!');
      if (onAttendanceMarked) {
        onAttendanceMarked();
      }
      setTimeout(() => {
        stopScanning();
        if (onClose) onClose();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark attendance');
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="rounded-lg bg-white p-6">
          <p className="text-slate-700">Loading face recognition...</p>
        </div>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="rounded-lg bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">No Students Registered</h2>
          <p className="mb-4 text-slate-600">
            Please register faces for students first before using facial recognition.
          </p>
          <button
            onClick={onClose}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative rounded-lg bg-white p-6 shadow-lg">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
        >
          ✕
        </button>
        <h2 className="mb-4 text-xl font-semibold">Facial Recognition Attendance</h2>
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-md bg-emerald-50 p-3 text-sm text-emerald-600">
            {success}
          </div>
        )}
        {recognizedStudent && (
          <div className="mb-4 rounded-md bg-blue-50 p-3">
            <p className="font-medium text-blue-900">
              Recognized: {recognizedStudent.name} ({recognizedStudent.studentId})
            </p>
          </div>
        )}
        <div className="relative mb-4">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="rounded-lg"
            width="640"
            height="480"
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 pointer-events-none"
          />
        </div>
        <div className="flex gap-2">
          {!scanning ? (
            <button
              onClick={startScanning}
              className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Start Recognition
            </button>
          ) : (
            <button
              onClick={stopScanning}
              className="flex-1 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Stop Scanning
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded-md bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-300"
          >
            Close
          </button>
        </div>
        <p className="mt-4 text-xs text-slate-500">
          {scanning
            ? 'Position your face in front of the camera...'
            : 'Click "Start Recognition" to begin facial recognition attendance.'}
        </p>
      </div>
    </div>
  );
}

