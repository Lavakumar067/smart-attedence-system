# Facial Recognition Setup Guide

## Overview
Your Smart Attendance System now supports facial recognition for automatic attendance marking!

## Setup Steps

### 1. Download Face-API.js Models

The face recognition library requires model files. Download them:

**Option A: Direct Download (Recommended)**
1. Visit: https://github.com/justadudewhohacks/face-api.js-models
2. Click "Code" → "Download ZIP"
3. Extract the ZIP file
4. Copy these files to `public/models/`:
   - `tiny_face_detector_model-weights_manifest.json`
   - `tiny_face_detector_model-shard1`
   - `face_landmark_68_model-weights_manifest.json`
   - `face_landmark_68_model-shard1`
   - `face_recognition_model-weights_manifest.json`
   - `face_recognition_model-shard1`
   - `face_recognition_model-shard2`

**Option B: Using Git (if you have git installed)**
```bash
cd public
git clone https://github.com/justadudewhohacks/face-api.js-models.git temp
mv temp/* models/
rm -rf temp
```

**Option C: Manual Download Links**
Download each file individually from:
- https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/tiny_face_detector_model-weights_manifest.json
- https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/tiny_face_detector_model-shard1
- (and so on for other files)

### 2. Verify Models Directory Structure

Your `public/models/` folder should contain:
```
public/
  models/
    ├── tiny_face_detector_model-weights_manifest.json
    ├── tiny_face_detector_model-shard1
    ├── face_landmark_68_model-weights_manifest.json
    ├── face_landmark_68_model-shard1
    ├── face_recognition_model-weights_manifest.json
    ├── face_recognition_model-shard1
    └── face_recognition_model-shard2
```

### 3. Restart Your Frontend Server

After adding the models, restart your frontend:
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## How to Use

### Register Student Faces

1. Go to **Students** page
2. Click **"+ Add Student"**
3. Fill in student details and click **"Add Student"**
4. When prompted, click **"OK"** to register their face
5. Position the student's face in front of the camera
6. Wait for "Face Detected ✓" message
7. Click **"Capture Face"**
8. Face encoding will be saved to the database

### Mark Attendance with Facial Recognition

1. Go to **Attendance** page
2. Click **"📷 Facial Recognition"** button
3. Click **"Start Recognition"**
4. Student positions their face in front of the camera
5. System automatically recognizes the face
6. Attendance is marked as "Present" automatically
7. Success message appears

### Manual Attendance (Still Available)

You can still mark attendance manually using the buttons on the Attendance page.

## Features

✅ **Face Registration** - Capture and store face encodings for each student
✅ **Real-time Recognition** - Live camera feed with face detection
✅ **Automatic Attendance** - Mark attendance when face is recognized
✅ **Manual Override** - Still supports manual attendance marking

## Troubleshooting

**Models not loading?**
- Check that all 7 model files are in `public/models/`
- Check browser console for errors
- Ensure frontend server is restarted after adding models

**Camera not working?**
- Allow camera permissions in browser
- Check if another app is using the camera
- Try a different browser

**Face not recognized?**
- Ensure good lighting
- Face should be clearly visible
- Try re-registering the face with better lighting
- Make sure student has registered their face first

**Performance Issues?**
- Use a modern browser (Chrome, Firefox, Edge)
- Ensure good internet connection (models load from server)
- Close other heavy applications

## Technical Details

- Uses **face-api.js** library for face detection and recognition
- Stores face encodings (128-dimensional vectors) in MongoDB
- Uses Euclidean distance for face matching
- Recognition threshold: 0.6 (adjustable in FaceRecognition.jsx)

