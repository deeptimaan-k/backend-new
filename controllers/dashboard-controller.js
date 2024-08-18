const Admin = require('../models/adminSchema');
const Teacher = require('../models/teacherSchema');
const Student = require('../models/studentSchema');
const Notice = require('../models/noticeSchema');
const Complaint = require('../models/complainSchema');
const Event = require('../models/eventSchema'); 
const Finance = require('../models/financeSchema');

exports.getDashboardStats = async (req, res) => {
    try {
        const totalStudents = await Student.countDocuments();
        const totalAdmins = await Admin.countDocuments();
        const totalNotices = await Notice.countDocuments();
        const totalComplaints = await Complaint.countDocuments();
        const totalTeachers = await Teacher.countDocuments();
        const totalEvents = await Event.countDocuments();
        const totalFinances = await Finance.countDocuments();

        res.status(200).json({
            totalStudents,
            totalAdmins,
            totalNotices,
            totalComplaints,
            totalTeachers,
            totalEvents,
            totalFinances,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching dashboard stats', error });
    }
};

exports.getStudentList = async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching students', error });
    }
};

exports.getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching student', error });
    }
};

exports.updateStudent = async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json(updatedStudent);
    } catch (error) {
        res.status(500).json({ message: 'Error updating student', error });
    }
};

exports.deleteStudent = async (req, res) => {
    try {
        const deletedStudent = await Student.findByIdAndDelete(req.params.id);
        if (!deletedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting student', error });
    }
};

exports.createNotice = async (req, res) => {
    try {
        const newNotice = new Notice(req.body);
        await newNotice.save();
        res.status(201).json({ message: 'Notice created successfully', newNotice });
    } catch (error) {
        res.status(500).json({ message: 'Error creating notice', error });
    }
};

exports.getAllNotices = async (req, res) => {
    try {
        const notices = await Notice.find();
        res.status(200).json(notices);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notices', error });
    }
};

exports.deleteNotice = async (req, res) => {
    try {
        const deletedNotice = await Notice.findByIdAndDelete(req.params.id);
        if (!deletedNotice) {
            return res.status(404).json({ message: 'Notice not found' });
        }
        res.status(200).json({ message: 'Notice deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting notice', error });
    }
};

exports.getAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find();
        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching complaints', error });
    }
};

exports.resolveComplaint = async (req, res) => {
    try {
        const resolvedComplaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            { status: 'resolved' },
            { new: true }
        );
        if (!resolvedComplaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }
        res.status(200).json({ message: 'Complaint resolved successfully', resolvedComplaint });
    } catch (error) {
        res.status(500).json({ message: 'Error resolving complaint', error });
    }
};

exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events', error });
    }
};

exports.createEvent = async (req, res) => {
    try {
        const newEvent = new Event(req.body);
        await newEvent.save();
        res.status(201).json({ message: 'Event created successfully', newEvent });
    } catch (error) {
        res.status(500).json({ message: 'Error creating event', error });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.id);
        if (!deletedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting event', error });
    }
};

exports.getAllFinanceRecords = async (req, res) => {
    try {
        const finances = await Finance.find();
        res.status(200).json(finances);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching finance records', error });
    }
};

exports.createFinanceRecord = async (req, res) => {
    try {
        const newFinance = new Finance(req.body);
        await newFinance.save();
        res.status(201).json({ message: 'Finance record created successfully', newFinance });
    } catch (error) {
        res.status(500).json({ message: 'Error creating finance record', error });
    }
};

exports.deleteFinanceRecord = async (req, res) => {
    try {
        const deletedFinance = await Finance.findByIdAndDelete(req.params.id);
        if (!deletedFinance) {
            return res.status(404).json({ message: 'Finance record not found' });
        }
        res.status(200).json({ message: 'Finance record deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting finance record', error });
    }
};

exports.getAbsentTeachers = async (req, res) => {
    try {
        const today = new Date().toISOString().slice(0, 10);
        const absentTeachers = await Teacher.find({
            'attendance.date': today,
            'attendance.presentCount': { $eq: 0 }
        });

        res.status(200).json(absentTeachers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching absent teachers', error });
    }
};

exports.addSubstitution = async (req, res) => {
    try {
        const { teacherId, substituteTeacherId, classId, date } = req.body;
        const teacher = await Teacher.findById(teacherId);
        const substituteTeacher = await Teacher.findById(substituteTeacherId);

        if (!teacher || !substituteTeacher) {
            return res.status(404).json({ message: 'Teacher or Substitute Teacher not found' });
        }

        teacher.tempSchedule.push({
            date,
            className: classId,
            section: teacher.section,
            subject: teacher.teachSubject,
            timing: req.body.timing,
            duration: req.body.duration,
            accessKey: req.body.accessKey,
            completeStatus: false,
        });

        await teacher.save();

        res.status(200).json({ message: 'Substitution added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding substitution', error });
    }
};
