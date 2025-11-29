# MongoDB Setup Guide

Since MongoDB is not installed locally, we'll use **MongoDB Atlas** (free cloud database).

## Option 1: MongoDB Atlas (Recommended - Free Cloud Database)

### Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up for a free account (no credit card required)
3. Verify your email

### Step 2: Create a Cluster
1. After logging in, click **"Build a Database"**
2. Choose **FREE (M0) Shared** cluster
3. Select a cloud provider and region (choose closest to you)
4. Click **"Create"** (takes 3-5 minutes)

### Step 3: Create Database User
1. Go to **"Database Access"** in the left menu
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter username and password (save these!)
5. Set privileges to **"Atlas admin"** or **"Read and write to any database"**
6. Click **"Add User"**

### Step 4: Whitelist Your IP Address
1. Go to **"Network Access"** in the left menu
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development) or add your current IP
4. Click **"Confirm"**

### Step 5: Get Connection String
1. Go back to **"Database"** (Clusters)
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string (looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/`)
5. Replace `<password>` with your database user password
6. Add database name at the end: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/smart-attendance`

### Step 6: Update .env File
Update your `.env` file in `smart-attendance-backend/`:

```
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/smart-attendance?retryWrites=true&w=majority
```

**Important:** Replace:
- `your-username` with your database username
- `your-password` with your database password
- `cluster0.xxxxx` with your actual cluster address

### Step 7: Restart Backend Server
```bash
cd smart-attendance-backend
npm run dev
```

You should see: `MongoDB Connected: ...`

---

## Option 2: Install MongoDB Locally (Alternative)

### Windows:
1. Download MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Run the installer
3. Choose "Complete" installation
4. Install as a Windows Service
5. MongoDB will run on `mongodb://localhost:27017`

Then update `.env`:
```
MONGODB_URI=mongodb://localhost:27017/smart-attendance
```

### macOS:
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Linux:
```bash
# Ubuntu/Debian
sudo apt-get install mongodb

# Start MongoDB
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

---

## Quick Test

After setup, test the connection:
1. Start your backend: `npm run dev`
2. You should see: `MongoDB Connected: ...`
3. Try registering a user in your app
4. Check MongoDB Atlas dashboard → Collections to see your data

---

## Troubleshooting

**Connection Error?**
- Check your connection string in `.env`
- Make sure password is URL-encoded (replace special chars with % codes)
- Verify IP is whitelisted in Network Access
- Check cluster is running (green status in Atlas)

**Can't connect?**
- Wait a few minutes after creating cluster
- Double-check username/password
- Try regenerating connection string in Atlas

