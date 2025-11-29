# How to Download Face-API.js Models

## The 7 Required Files:

1. **tiny_face_detector_model-weights_manifest.json**
2. **tiny_face_detector_model-shard1**
3. **face_landmark_68_model-weights_manifest.json**
4. **face_landmark_68_model-shard1**
5. **face_recognition_model-weights_manifest.json**
6. **face_recognition_model-shard1**
7. **face_recognition_model-shard2**

## Method 1: Direct Download (Easiest)

### Step 1: Go to the GitHub Repository
Visit: https://github.com/justadudewhohacks/face-api.js-models

### Step 2: Download Individual Files
Click on each file name, then click the "Download" button (or "Raw" button) to download:

1. Go to: https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/tiny_face_detector_model-weights_manifest.json
   - Right-click → Save As → Save to `smart-attendance-frontend/public/models/`

2. Go to: https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/tiny_face_detector_model-shard1
   - Right-click → Save As → Save to `smart-attendance-frontend/public/models/`

3. Go to: https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/face_landmark_68_model-weights_manifest.json
   - Right-click → Save As → Save to `smart-attendance-frontend/public/models/`

4. Go to: https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/face_landmark_68_model-shard1
   - Right-click → Save As → Save to `smart-attendance-frontend/public/models/`

5. Go to: https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/face_recognition_model-weights_manifest.json
   - Right-click → Save As → Save to `smart-attendance-frontend/public/models/`

6. Go to: https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/face_recognition_model-shard1
   - Right-click → Save As → Save to `smart-attendance-frontend/public/models/`

7. Go to: https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/face_recognition_model-shard2
   - Right-click → Save As → Save to `smart-attendance-frontend/public/models/`

## Method 2: Download ZIP (Faster)

1. Go to: https://github.com/justadudewhohacks/face-api.js-models
2. Click the green **"Code"** button
3. Click **"Download ZIP"**
4. Extract the ZIP file
5. Copy all 7 files from the extracted folder to `smart-attendance-frontend/public/models/`

## Method 3: Using Git (If you have Git installed)

Open terminal in your project root and run:
```bash
cd smart-attendance-frontend/public
git clone https://github.com/justadudewhohacks/face-api.js-models.git temp
mv temp/* models/
rm -rf temp
```

## Method 4: Using PowerShell (Windows)

Run this in PowerShell from your project root:
```powershell
cd smart-attendance-frontend/public/models
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/tiny_face_detector_model-weights_manifest.json" -OutFile "tiny_face_detector_model-weights_manifest.json"
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/tiny_face_detector_model-shard1" -OutFile "tiny_face_detector_model-shard1"
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/face_landmark_68_model-weights_manifest.json" -OutFile "face_landmark_68_model-weights_manifest.json"
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/face_landmark_68_model-shard1" -OutFile "face_landmark_68_model-shard1"
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/face_recognition_model-weights_manifest.json" -OutFile "face_recognition_model-weights_manifest.json"
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/face_recognition_model-shard1" -OutFile "face_recognition_model-shard1"
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/face_recognition_model-shard2" -OutFile "face_recognition_model-shard2"
```

## Verify Files Are Downloaded

After downloading, your `smart-attendance-frontend/public/models/` folder should contain exactly these 7 files:
- tiny_face_detector_model-weights_manifest.json
- tiny_face_detector_model-shard1
- face_landmark_68_model-weights_manifest.json
- face_landmark_68_model-shard1
- face_recognition_model-weights_manifest.json
- face_recognition_model-shard1
- face_recognition_model-shard2

## After Downloading

1. Restart your frontend server:
   ```bash
   cd smart-attendance-frontend
   npm run dev
   ```

2. Test face registration:
   - Go to Students page
   - Add a student or click "Register Face" for existing student
   - Camera should work and models should load

