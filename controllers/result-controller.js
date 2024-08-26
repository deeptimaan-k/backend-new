const Assignment = require("../models/assignmentSchema");
const TestResult = require("../models/resultSchema");

const submitTest = async (req, res) => {
    const { assignmentId, userId, results } = req.body;

    if (!assignmentId || !userId || !Array.isArray(results)) {
        return res.status(400).json({ message: 'Invalid input data' });
    }

    try {
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        let totalMarks = 0;
        const questions = results.map(result => {
            const question = assignment.questions.find(q => q.question === result.question);
            if (!question) {
                console.log('Question not found:', result.question);
                return null;
            }
            const isCorrect = question.correct === result.userAnswer;
            if (isCorrect) {
                totalMarks += 1;
            }
            return {
                questionId: question._id,
                correct: isCorrect,
                attempted: result.userAnswer !== null && result.userAnswer !== undefined
            };
        }).filter(Boolean);

        const newTestResult = new TestResult({
            userId,
            assignmentId,
            questions,
            totalMarks
        });

        await newTestResult.save();

        assignment.attempted = true;

        res.status(200).json({
            message: 'Test results saved successfully',
            questions,
            totalMarks
        });
    } catch (error) {
        console.error('Error submitting test:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};

const getClassResultAnalysis = async (req, res) => {
    const { classId } = req.params;

    if (!classId) {
        return res.status(400).json({ message: 'Class ID is required' });
    }

    try {
        const results = await TestResult.find({ classId }).populate('assignmentId');

        if (results.length === 0) {
            return res.status(404).json({ message: 'No results found for this class' });
        }

        const totalStudents = results.length;
        let totalMarks = 0;
        let passingStudents = 0;
        const passMark = 50;
        results.forEach(result => {
            totalMarks += result.totalMarks;
            if (result.totalMarks >= passMark) {
                passingStudents += 1;
            }
        });

        const averageMarks = totalMarks / totalStudents;
        const passRate = (passingStudents / totalStudents) * 100;

        res.status(200).json({
            message: 'Class result analysis retrieved successfully',
            totalStudents,
            averageMarks,
            passRate,
            passingStudents
        });
    } catch (error) {
        console.error('Error retrieving class result analysis:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};

module.exports = {
    submitTest,
    getClassResultAnalysis
};
