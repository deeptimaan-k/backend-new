const mongoose = require('mongoose');
const Student = require('../models/studentSchema');
const Subject = require('../models/subjectSchema');
const Teacher = require('../models/teacherSchema');

// Helper function to format date to YYYY-MM-DD
const formatDate = (date) => {
    return new Date(date).toISOString().split('T')[0];
};

// Controller function to get student's daily activity by student ID
exports.getStudentTodaysActivity = async (req, res) => {
    try {
        const { studentId } = req.params; // Get student ID from URL parameters

        // Fetch student by ID
        const student = await Student.findById(studentId)
            .populate('sclassName') // Populate class data
            .populate('school') // Populate school data
            .populate('attendance.subName'); // Populate subject data in attendance

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Get today's date
        const today = formatDate(new Date());

        // Fetch teachers' subjects for today's date
        const teachers = await Teacher.find({
            school: student.school._id,
            teachSclass: student.sclassName._id
        }).populate('teachSubject'); // Populate subject data

        // Format timetable
        const timetable = teachers.map(teacher => ({
            subName: teacher.teachSubject.subName,
            topic: teacher.teachSubject.topic, // Adjust if the field is different
            timing: teacher.teachSubject.timing, // Adjust if the field is different
            duration: teacher.teachSubject.duration, // Adjust if the field is different
            teacher: teacher.name
        }));

        // Determine attendance status for today
        const attendanceRecord = student.attendance.find(record => formatDate(record.date) === today);
        
        // Check if attendanceRecord is found and handle accordingly
        const subjectName = attendanceRecord ? 
            (await Subject.findById(attendanceRecord.subName))?.subName : 
            null;

        const attendance = attendanceRecord
            ? {
                date: attendanceRecord.date,
                status: attendanceRecord.status,
                subName: subjectName || 'Unknown Subject'
              }
            : 'No record for today';

        const response = {
            studentName: student.name,
            rollNum: student.rollNum,
            schoolReached: attendanceRecord ? 'Yes' : 'No',
            attendance: attendance,
            timetable: timetable
        };

        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
