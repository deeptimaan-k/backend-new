// controllers/dashboard-controller.js

const Event = require('../models/eventSchema');
const Finance = require('../models/financeSchema');
const Student = require('../models/studentSchema');
const Teacher = require('../models/teacherSchema');
const Notification = require('../models/notificationSchema');
const Substitution = require('../models/substitutionSchema');
// const Complaint = require('../models/complaintSchema'); // Assuming this schema exists
// const Notice = require('../models/noticeSchema'); // Assuming this schema exists

// Dashboard Overview
exports.getDashboardOverview = async (req, res) => {
    try {
        // Example data aggregation for overview
        const totalEvents = await Event.countDocuments();
        const totalFinances = await Finance.countDocuments();
        const totalStudents = await Student.countDocuments();
        const totalTeachers = await Teacher.countDocuments();

        res.status(200).json({
            totalEvents,
            totalFinances,
            totalStudents,
            totalTeachers,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Event Controllers
exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find().populate('school');
        res.status(200).json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createEvent = async (req, res) => {
    try {
        const event = new Event(req.body);
        await event.save();
        res.status(201).json(event);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(event);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.status(204).json({ message: 'Event deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Finance Controllers
exports.getAllFinances = async (req, res) => {
    try {
        const finances = await Finance.find().populate('school');
        res.status(200).json(finances);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createFinance = async (req, res) => {
    try {
        const finance = new Finance(req.body);
        await finance.save();
        res.status(201).json(finance);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateFinance = async (req, res) => {
    try {
        const finance = await Finance.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(finance);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteFinance = async (req, res) => {
    try {
        await Finance.findByIdAndDelete(req.params.id);
        res.status(204).json({ message: 'Finance record deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Student Controllers
exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find().populate('sclassName school');
        res.status(200).json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).populate('sclassName school');
        if (!student) return res.status(404).json({ message: 'Student not found' });
        res.status(200).json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createStudent = async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.status(201).json(student);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!student) return res.status(404).json({ message: 'Student not found' });
        res.status(200).json(student);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteStudent = async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.status(204).json({ message: 'Student deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Teacher Controllers
exports.getAllTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find().populate('teachSubject teachSclass school');
        res.status(200).json(teachers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getTeacherById = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id).populate('teachSubject teachSclass school');
        if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
        res.status(200).json(teacher);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createTeacher = async (req, res) => {
    try {
        const teacher = new Teacher(req.body);
        await teacher.save();
        res.status(201).json(teacher);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
        res.status(200).json(teacher);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteTeacher = async (req, res) => {
    try {
        await Teacher.findByIdAndDelete(req.params.id);
        res.status(204).json({ message: 'Teacher deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// total present students
exports.getTotalStudentsPresentToday = async (req, res) => {
    try {
        const today = new Date();
        const startOfDay = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())); // Set time to start of the day in UTC
        console.log(startOfDay)
        const presentStudentsCount = await Student.countDocuments({
            attendance: {
                $elemMatch: {
                    date: startOfDay,
                    status: "Present"
                }
            }
        });

        res.status(200).json({ totalPresentStudents: presentStudentsCount });
    } catch (error) {
        res.status(500).json({ message: "Error fetching present students count", error });
    }
};

//total absent students
exports.getTotalStudentsAbsentToday = async (req, res) => {
    try {
        const today = new Date();
        const startOfDay = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())); // Set time to start of the day in UTC
        console.log(startOfDay)
        const presentStudentsCount = await Student.countDocuments({
            attendance: {
                $elemMatch: {
                    date: startOfDay,
                    status: "Absent"
                }
            }
        });

        res.status(200).json({ totalPresentStudents: presentStudentsCount });
    } catch (error) {
        res.status(500).json({ message: "Error fetching present students count", error });
    }
};

//total number of teacher present
exports.getTotalTeachersPresentToday = async (req, res) => {
    try {
        const today = new Date();
        const startOfDay = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
        const presentTeachersCount = await Teacher.countDocuments({
            attendance: {
                $elemMatch: {
                    date: startOfDay,
                    presentCount: { $gt: 0 }  // Checking if presentCount is greater than 0
                }
            }
        });

        res.status(200).json({ totalPresentTeachers: presentTeachersCount });
    } catch (error) {
        res.status(500).json({ message: "Error fetching present teachers count", error });
    }
};


//total number of teacher Absent
exports.getTotalTeachersAbesntToday = async (req, res) => {
    try {
        const { date } = req.query; // Expecting date in YYYY-MM-DD format or similar

        const absentTeachers = await Teacher.find({
            "attendance.date": new Date(date),
            "attendance.absentCount": { $gt: 0 }
        });

        res.status(200).json(absentTeachers);
    } catch (error) {
        res.status(500).json({ message: "Error fetching absent teachers", error });
    }
};

// Notification Controllers
exports.sendNotification = async (req, res) => {
    const { recipientType, recipientId, message } = req.body;

    try {
        const notification = new Notification({
            recipientType,
            recipientId,
            message,
        });

        await notification.save();
        res.status(201).json(notification);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getNotifications = async (req, res) => {
    const { recipientType, recipientId } = req.query;

    try {
        const notifications = await Notification.find({
            recipientType,
            recipientId,
        }).sort({ createdAt: -1 });

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteNotification = async (req, res) => {
    try {
        await Notification.findByIdAndDelete(req.params.id);
        res.status(204).json({ message: 'Notification deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Substitution Controllers
exports.addSubstitution = async (req, res) => {
    try {
        const substitution = new Substitution(req.body);
        await substitution.save();
        res.status(201).json(substitution);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getSubstitutionsByDate = async (req, res) => {
    const { date } = req.query;
    try {
        const substitutions = await Substitution.find({ date });
        res.status(200).json(substitutions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// // Complaint Controllers
// exports.getAllComplaints = async (req, res) => {
//     try {
//         const complaints = await Complaint.find();
//         res.status(200).json(complaints);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

// exports.createComplaint = async (req, res) => {
//     try {
//         const complaint = new Complaint(req.body);
//         await complaint.save();
//         res.status(201).json(complaint);
//     } catch (err) {
//         res.status(400).json({ error: err.message });
//     }
// };

// exports.updateComplaint = async (req, res) => {
//     try {
//         const complaint = await Complaint.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         res.status(200).json(complaint);
//     } catch (err) {
//         res.status(400).json({ error: err.message });
//     }
// };

// exports.deleteComplaint = async (req, res) => {
//     try {
//         await Complaint.findByIdAndDelete(req.params.id);
//         res.status(204).json({ message: 'Complaint deleted successfully' });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

// Notice Controllers
// exports.getAllNotices = async (req, res) => {
//     try {
//         const notices = await Notice.find();
//         res.status(200).json(notices);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

// exports.createNotice = async (req, res) => {
//     try {
//         const notice = new Notice(req.body);
//         await notice.save();
//         res.status(201).json(notice);
//     } catch (err) {
//         res.status(400).json({ error: err.message });
//     }
// };

// exports.updateNotice = async (req, res) => {
//     try {
//         const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         res.status(200).json(notice);
//     } catch (err) {
//         res.status(400).json({ error: err.message });
//     }
// };

// exports.deleteNotice = async (req, res) => {
//     try {
//         await Notice.findByIdAndDelete(req.params.id);
//         res.status(204).json({ message: 'Notice deleted successfully' });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };
