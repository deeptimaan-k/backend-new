const Assignment = require("../models/assignmentSchema");
const { addAssignment } = require("./ai-classroom-controller");

const addAssignmentByTeacher = async (req, res) => {
    const { teacherId, class: className, subject, chapter, topic, title, ques_type, num_ques } = req.body;

    try {
        const response = await addAssignment(req, res);

        if (res.headersSent) {
            return;
        }

        if (response.status === 201) {
            const savedAssignment = response.data;
            savedAssignment.teacherId = teacherId;
            const updatedAssignment = await savedAssignment.save();

            return res.status(200).json(updatedAssignment);
        } else {
            return res.status(response.status).json({ message: 'Failed to create assignment' });
        }
    } catch (error) {
        console.error('Error adding assignment by teacher:', error.message);
        if (!res.headersSent) {
            return res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }
};

const pendingAssignment = async (req, res) => {
    const { classId } = req.params;
    try {
        const assignments = await Assignment.find({ classId, attempted: false });
        res.json(assignments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    addAssignmentByTeacher,
    pendingAssignment,
};
