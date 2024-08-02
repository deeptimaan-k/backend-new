const AiClassS = require("../models/classroomSchema");
const Assignment = require("../models/assignmentSchema")
const axios = require('axios');

// const getAssignments = async (req, res) => {
//     const { class: className, subject, chapter, topic } = req.params;
//     try {
//         const response = await axios.get('models api', {
//             params: {
//                 class: className,
//                 subject: subject,
//                 chapter: chapter,
//                 topic: topic
//             }
//         });

//         const questions = response.data;
//         const formattedAssignments = formatAssignments(questions);

//         res.json(formattedAssignments);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// const formatAssignments = (questions) => {
//     return questions.map(question => {
//         if (question.type === 'mcq') {
//             return {
//                 type: 'mcq',
//                 question: question.text,
//                 options: question.options,
//                 answer: question.answer
//             };
//         } else if (question.type === 'fill-in-the-blanks') {
//             return {
//                 type: 'fill-in-the-blanks',
//                 question: question.text,
//                 answer: question.answer
//             };
//         } else {
//             return {
//                 type: 'unknown',
//                 question: question.text
//             };
//         }
//     });
// };

const addClassSubjectChapter = async (req, res) => {
    const { class: className, subject, chapters } = req.body;

    try {
        const newClassroom = new AiClassS({
            class: className,
            subject,
            chapters
        });

        const savedClassroom = await newClassroom.save();
        res.status(201).json(savedClassroom);
    } catch (error) {
        console.error('Error adding class subject chapter:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};

const addAssignment = async (req, res) => {
    const { classId, subject, chapter, topic, title, questions } = req.body;

    try {
        const newAssignment = new Assignment({
            title,
            classId,
            subject,
            chapter,
            topic,
            questions
        });

        const savedAssignment = await newAssignment.save();

        const classroom = await AiClassS.findById(classId);
        const chapterIndex = classroom.chapters.findIndex(ch => ch.title === chapter);

        if (chapterIndex !== -1) {
            classroom.chapters[chapterIndex].assignments.push(savedAssignment._id);
            await classroom.save();
        }

        res.status(201).json(savedAssignment);
    } catch (error) {
        console.error('Error adding assignment:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};

const getAssignmentsByTopic = async (req, res) => {
    const { className, subject, chapter, topic } = req.params;


    try {
        const classroom = await AiClassS.findOne({ class: className, subject });

        if (!classroom) {
            return res.status(404).json({ message: 'Class and subject not found' });
        }
        const chapterData = classroom.chapters.find(ch => ch.title === chapter);
        if (!chapterData) {
            return res.status(404).json({ message: 'Chapter not found' });
        }

        const assignments = await Assignment.find({ _id: { $in: chapterData.assignments } });

        const topicAssignments = assignments.filter(assignment =>
            assignment.topic && assignment.topic.toLowerCase() === topic.toLowerCase()
        );

        if (topicAssignments.length === 0) {
            return res.status(404).json({ message: 'No assignments found for the given topic' });
        }

        res.status(200).json(topicAssignments);
    } catch (error) {
        console.error('Error fetching assignments:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};

const getClassSubjectDetails = async (req, res) => {
    const { class: className, subject } = req.params;

    try {
        const classroom = await AiClassS.findOne({ class: className, subject }).populate('chapters.assignments');
        if (!classroom) {
            return res.status(404).json({ message: 'Class and subject not found' });
        }

        res.status(200).json(classroom);
    } catch (error) {
        console.error('Error fetching class subject details:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};

module.exports = {
    addClassSubjectChapter,
    addAssignment,
    getClassSubjectDetails,
    getAssignmentsByTopic
};
