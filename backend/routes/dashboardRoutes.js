// routes/dashboard-routes.js

const express = require('express');
const dashboardController = require('../controllers/dashboard-controller');

const router = express.Router();

// Dashboard Overview
router.get('/overview', dashboardController.getDashboardOverview);

// Events
router.get('/events', dashboardController.getAllEvents);
router.post('/events', dashboardController.createEvent);
router.put('/events/:id', dashboardController.updateEvent);
router.delete('/events/:id', dashboardController.deleteEvent);

// Finances
router.get('/finances', dashboardController.getAllFinances);
router.post('/finances', dashboardController.createFinance);
router.put('/finances/:id', dashboardController.updateFinance);
router.delete('/finances/:id', dashboardController.deleteFinance);

// Students
router.get('/students', dashboardController.getAllStudents);
router.get('/students/:id', dashboardController.getStudentById);
router.post('/students', dashboardController.createStudent);
router.put('/students/:id', dashboardController.updateStudent);
router.delete('/students/:id', dashboardController.deleteStudent);

// Teachers
router.get('/teachers', dashboardController.getAllTeachers);
router.get('/teachers/:id', dashboardController.getTeacherById);
router.post('/teachers', dashboardController.createTeacher);
router.put('/teachers/:id', dashboardController.updateTeacher);
router.delete('/teachers/:id', dashboardController.deleteTeacher);

// Student Attendance
router.get('/students/:studentId/attendance', dashboardController.getStudentAttendance);
router.post('/students/:studentId/attendance', dashboardController.markStudentAttendance);

// Teacher Attendance
router.get('/teachers/:teacherId/attendance', dashboardController.getTeacherAttendance);
router.post('/teachers/:teacherId/attendance', dashboardController.markTeacherAttendance);

// Notifications
router.get('/notifications', dashboardController.getNotifications);
router.post('/notifications', dashboardController.sendNotification);
router.delete('/notifications/:id', dashboardController.deleteNotification);

// Substitutions
router.post('/substitutions', dashboardController.addSubstitution);
router.get('/substitutions', dashboardController.getSubstitutionsByDate);

// Complaints
// router.get('/complaints', dashboardController.getAllComplaints);
// router.post('/complaints', dashboardController.createComplaint);
// router.put('/complaints/:id', dashboardController.updateComplaint);
// router.delete('/complaints/:id', dashboardController.deleteComplaint);

// Notices
// router.get('/notices', dashboardController.getAllNotices);
// router.post('/notices', dashboardController.createNotice);
// router.put('/notices/:id', dashboardController.updateNotice);
// router.delete('/notices/:id', dashboardController.deleteNotice);

module.exports = router;
