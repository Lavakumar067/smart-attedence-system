import { useRef, useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';

export default function FaceRegistration({ onFaceCaptured, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadModels();
    startCamera();

    return () => {
      stopCamera();
    };
  }, []);

  const loadModels = async () => {
    try {
      setLoading(true);
      setError('');
      const MODEL_URL = '/models';
      
      // Check if models exist
      try {
        const testResponse = await fetch(`${MODEL_URL}/tiny_face_detector_model-weights_manifest.json`);
        if (!testResponse.ok) {
          throw new Error('Models not found');
        }
      } catch (fetchErr) {
        setError('Face recognition models not found. Please download them to /public/models/ folder. See FACIAL_RECOGNITION_SETUP.md for instructions.');
        setLoading(false);
        return;
      }
      
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]);
      
      setModelsLoaded(true);
      setLoading(false);
    } catch (err) {
      console.error('Error loading models:', err);
      setError(`Failed to load face recognition models: ${err.message}. Please ensure all 7 model files are in /public/models/ folder.`);
      setLoading(false);
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

  const detectFace = async () => {
    if (!modelsLoaded || !videoRef.current || !canvasRef.current) return;

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!video.videoWidth || !video.videoHeight) {
        requestAnimationFrame(detectFace);
        return;
      }

      const displaySize = { width: video.videoWidth, height: video.videoHeight };
      faceapi.matchDimensions(canvas, displaySize);

      const detection = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detection) {
        setFaceDetected(true);
        const resizedDetection = faceapi.resizeResults(detection, displaySize);
        faceapi.draw.drawDetections(canvas, resizedDetection);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetection);
      } else {
        setFaceDetected(false);
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    } catch (err) {
      console.error('Error in detectFace:', err);
    }

    requestAnimationFrame(detectFace);
  };

  useEffect(() => {
    if (modelsLoaded && videoRef.current) {
      detectFace();
    }
    return () => {
      // Cleanup
    };
  }, [modelsLoaded]);

  const captureFace = async () => {
    if (!faceDetected) {
      setError('Please position your face in front of the camera');
      return;
    }

    try {
      setCapturing(true);
      const video = videoRef.current;
      const detection = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detection) {
        const descriptor = Array.from(detection.descriptor);
        onFaceCaptured(descriptor);
        stopCamera();
      } else {
        setError('Face not detected. Please try again.');
      }
    } catch (err) {
      console.error('Error capturing face:', err);
      setError('Failed to capture face. Please try again.');
    } finally {
      setCapturing(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <p className="text-slate-700">Loading face recognition models...</p>
          <p className="mt-2 text-xs text-slate-500">This may take a few seconds...</p>
        </div>
      </div>
    );
  }

  if (error && !modelsLoaded) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="relative rounded-lg bg-white p-6 shadow-lg max-w-md">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
          <h2 className="mb-4 text-xl font-semibold">Error Loading Models</h2>
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
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
        <h2 className="mb-4 text-xl font-semibold">Register Face</h2>
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}
        <div className="relative mb-4">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="rounded-lg bg-slate-900"
            width="640"
            height="480"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 pointer-events-none"
            width="640"
            height="480"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
          {faceDetected && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-white">
              Face Detected ✓
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={captureFace}
            disabled={!faceDetected || capturing}
            className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {capturing ? 'Capturing...' : 'Capture Face'}
          </button>
          <button
            onClick={onClose}
            className="rounded-md bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-300"
          >
            Cancel
          </button>
        </div>
        <p className="mt-4 text-xs text-slate-500">
          Position your face in the center of the camera and ensure good lighting.
        </p>
      </div>
    </div>
  );
}

