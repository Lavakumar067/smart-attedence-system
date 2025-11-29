# Face-API.js Models

Download the following model files and place them in this `public/models/` directory:

1. **tiny_face_detector_model-weights_manifest.json**
2. **tiny_face_detector_model-shard1**
3. **face_landmark_68_model-weights_manifest.json**
4. **face_landmark_68_model-shard1**
5. **face_recognition_model-weights_manifest.json**
6. **face_recognition_model-shard1**
7. **face_recognition_model-shard2**

## How to Download:

### Option 1: Direct Download
Visit: https://github.com/justadudewhohacks/face-api.js-models

Download the models from the repository and extract them to this folder.

### Option 2: Using npm/yarn
```bash
# In your project root
npm install @vladmandic/face-api
# Then copy models from node_modules/@vladmandic/face-api/model/ to public/models/
```

### Option 3: Quick Download Script
Run this in your terminal (from project root):
```bash
cd public/models
curl -L https://github.com/justadudewhohacks/face-api.js-models/archive/refs/heads/master.zip -o models.zip
# Extract and copy files to this directory
```

## File Structure Should Be:
```
public/
  models/
    tiny_face_detector_model-weights_manifest.json
    tiny_face_detector_model-shard1
    face_landmark_68_model-weights_manifest.json
    face_landmark_68_model-shard1
    face_recognition_model-weights_manifest.json
    face_recognition_model-shard1
    face_recognition_model-shard2
```

