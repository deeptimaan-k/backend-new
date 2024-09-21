const ApplyLeave  = require("../models/leaveSchema");
const Student = require("../models/studentSchema");

const applyLeave = async (req, res) => {
    const { studentId, reason, leaveFrom, leaveTo } = req.body;
    try {
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const newLeave = new ApplyLeave({
            studentId,
            reason,
            leaveFrom,
            leaveTo
        });

        await newLeave.save();
        res.status(201).json(newLeave);
    }
    catch (error) {
        console.error('Error applying leave:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getLeaves = async (req, res) => {
    const { studentId } = req.params;
    try {
        const leaves = await ApplyLeave.find({ studentId }).sort({ createdAt: -1 });
        res.status(200).json(leaves);
    } catch (error) {
        console.error('Error fetching leaves:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateLeaveStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const Leave = await ApplyLeave.findByIdAndUpdate(id, { status }, { new: true });
        if (!Leave) {
            return res.status(404).json({ message: 'Leave not found' });
        }
        res.status(200).json(Leave);
    }
    catch (error) {
        console.error('Error updating leave status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getStudentAttendance= async(req,res) =>{
    const {studentId} = req.params;

    try {
        const student = await Student.findById(studentId).select('attendance').populate('attendance.subName', 'subjectName');

        if (!student) {
            console.log("Student not found");
            return;
        }
        res.status(200).json(student)
    } catch (err) {
        console.error("Error fetching attendance:", err);
        res.status(500).json({ message: "Internal server error"});
    }
};

module.exports = {
    applyLeave,
    getLeaves,
    updateLeaveStatus,
    getStudentAttendance
};