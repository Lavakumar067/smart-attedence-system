# Smart Attendance Backend API

Express.js backend API for the Smart Attendance System with MongoDB and JWT authentication.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env` file:**
   Copy `.env.example` to `.env` and update the values:
   ```bash
   cp .env.example .env
   ```

3. **Update `.env` with your MongoDB URI:**
   - Local MongoDB: `mongodb://localhost:27017/smart-attendance`
   - MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/smart-attendance`

4. **Start MongoDB:**
   Make sure MongoDB is running on your system.

5. **Run the server:**
   ```bash
   # Development mode (with auto-reload)
   npm run dev

   # Production mode
   npm start
   ```

The server will run on `http://localhost:5000` (or the PORT specified in `.env`).

## API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Students (`/api/students`)
- `GET /api/students` - Get all students (Protected)
- `GET /api/students/:id` - Get single student (Protected)
- `POST /api/students` - Create student (Protected)
- `PUT /api/students/:id` - Update student (Protected)
- `DELETE /api/students/:id` - Delete student (Protected)

### Attendance (`/api/attendance`)
- `GET /api/attendance` - Get all attendance records (Protected)
- `POST /api/attendance` - Mark attendance (Protected)
- `GET /api/attendance/stats` - Get attendance statistics (Protected)
- `GET /api/attendance/student/:studentId` - Get attendance by student (Protected)
- `PUT /api/attendance/:id` - Update attendance (Protected)
- `DELETE /api/attendance/:id` - Delete attendance (Protected)

## Authentication

Protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your-token>
```

## Project Structure

```
smart-attendance-backend/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   ├── authController.js
│   ├── attendanceController.js
│   └── studentController.js
├── middleware/
│   ├── authMiddleware.js  # JWT authentication
│   └── errorMiddleware.js  # Error handling
├── models/
│   ├── User.js            # User/Admin schema
│   ├── Student.js         # Student schema
│   └── Attendance.js      # Attendance schema
├── routes/
│   ├── auth.js
│   ├── attendance.js
│   └── students.js
├── server.js              # Entry point
└── package.json
```

