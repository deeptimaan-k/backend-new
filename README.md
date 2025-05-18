# RadiantEd - School Management System API

![School Management System](https://img.shields.io/badge/School%20Management-System-blue)
![Express.js](https://img.shields.io/badge/Express.js-4.x-orange)
![Node.js](https://img.shields.io/badge/Node.js-16.x-green)
![License](https://img.shields.io/badge/license-MIT-blue)

A comprehensive school management system backend API built with Express.js that handles administration, student management, teacher management, class management, attendance tracking, exam creation, fee management, finance tracking, and more.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [API Endpoints](#api-endpoints)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Authentication](#authentication)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- **Admin Management**: Registration, login, profile management
- **Student Management**: Registration, attendance tracking, achievement records
- **Teacher Management**: Registration, scheduling, attendance, substitutions
- **Class Management**: Creation, student listing, subject assignment
- **Subject Management**: Assignment to classes, chapters management
- **AI Classroom**: Digital learning environment with assignments
- **Exam System**: Creation, mark uploading, and result management
- **Finance Management**: Fee tracking, revenue and expense management
- **Notice Board**: School-wide announcements
- **Complain System**: Student and teacher complaints
- **Event Management**: School events tracking
- **Employee Management**: Non-teaching staff management
- **Dashboard Analytics**: School performance statistics
- **File Management**: Notes and video uploads to S3 bucket

## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB (assumed based on project structure)
- JWT Authentication
- Multer for file uploads
- AWS S3 for file storage
- Payment Gateway Integration

## 🔗 API Endpoints

### Admin Routes
- `POST /AdminReg` - Register new admin
- `POST /AdminLogin` - Admin login
- `GET /GetAdminById/:id` - Get admin details
- `PUT /UpdateAdmin/:id` - Update admin profile
- `POST /AssingScheduleWithAccessKey/:id` - Create access key for scheduling
- `GET /findavailableTeacher` - Find available teachers
- `POST /createExam` - Create examination

### Student Routes
- `POST /StudentReg/:id` - Register new student
- `GET /StudentsById/:id` - Get student details
- `GET /allstudents` - Get all students
- `GET /filterstudents` - Filter students by criteria
- `PUT /addStudentAchievements/:studentId` - Add student achievements
- `PUT /markStudentAttendance` - Mark student attendance
- `GET /getStudentAttendance` - Get attendance records

### Teacher Routes
- `POST /TeacherReg` - Register new teacher
- `POST /TeacherLoginWithEmail` - Teacher login
- `GET /Teacher/:id` - Get teacher details
- `POST /getAllTeacherClass/:id` - Get teacher's class schedule
- `POST /TeacherAttendance/:id` - Mark teacher attendance
- `GET /allteachers` - Get all teachers
- `GET /filterteacher` - Filter teachers by criteria

### Class Routes
- `POST /SclassCreate` - Create new class
- `GET /SclassList/:id` - List all classes
- `GET /Sclass/:id` - Get class details
- `GET /Sclass/Students/:id` - Get students in a class
- `DELETE /Sclass/:id` - Delete a class

### Subject & Chapter Routes
- `POST /SubjectCreate` - Create new subject
- `GET /ClassSubjects/:id` - Get subjects by class
- `POST /classroom` - Add class-subject-chapter
- `GET /classroom/:class/:subject` - Get class-subject details
- `GET /classes/:className/subjects/:subjectName/chapters` - Get chapters by subject

### Finance Routes
- `POST /fees` - Create fee with invoice
- `GET /fees` - Get fees with invoices
- `PATCH /fees/:feeId` - Update fee status
- `GET /fees/pending` - Get total pending fees
- `POST /expenses` - Create expense
- `GET /expenses/total` - Get total expenses
- `POST /revenues` - Create revenue
- `GET /revenues/total` - Get total revenue

### Dashboard Routes
- `GET /stats` - Get dashboard statistics
- `POST /events` - Create school event
- `GET /events` - Get all events

### Payment Routes
- `POST /payments/:schoolId` - Create payment
- `POST /payments/verify/:schoolId` - Verify payment

### Notice & Complain Routes
- `POST /NoticeCreate` - Create new notice
- `GET /NoticeList/:id` - List all notices
- `POST /ComplainCreate` - Create new complaint
- `GET /ComplainList/:id` - List all complaints

### Content Management Routes
- `POST /uploadNotes` - Upload study notes
- `POST /classes/:className/subjects/:subjectName/chapters/:chapterId/video` - Upload video
- `POST /assignment` - Create assignment

## 🚀 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/deeptimaan-k/backend-new.git
   cd backend-new
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (see [Environment Variables](#environment-variables) section)

4. Start the server:
   ```bash
   npm start
   ```

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=8000
MONGO_URI=mongodb://localhost:27017/school_management
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
S3_BUCKET_NAME=your_s3_bucket_name

# Email Configuration (for OTP)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_password

# Payment Gateway Configuration
PAYMENT_GATEWAY_KEY=your_payment_gateway_key
PAYMENT_GATEWAY_SECRET=your_payment_gateway_secret
```

## 📝 Usage

After starting the server, the API will be available at `http://localhost:8000` (or your configured PORT).

You can use tools like Postman or curl to interact with the API endpoints.

### Basic Flow:

1. Register an admin account
2. Log in as admin to get JWT token
3. Use the token for authenticated requests
4. Create classes, subjects, and register teachers/students
5. Manage school operations through the various endpoints

## 🔒 Authentication

The system uses JWT (JSON Web Token) for authentication. Protected routes require a valid JWT token in the Authorization header:

```
Authorization: Bearer your_jwt_token
```

## 📚 Documentation

For detailed API documentation:

1. The API endpoints are listed in this README
2. Refer to the code comments for specific implementation details
3. Check the controllers in the repository for business logic

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contact

For any inquiries or issues, please open an issue on the GitHub repository.

---

Developed with ❤️ for efficient school management
