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

        const questions = results.map(result => {
            const question = assignment.questions.find(q => q.question === result.question);
            if (!question) {
                console.log('Question not found:', result.question);
                return null;
            }
            return {
                question: result.question,
                userAnswer: result.userAnswer,
                correctAnswer: question.correct,
                correct: question.correct === result.userAnswer,
                attempted: result.userAnswer !== null && result.userAnswer !== undefined
            };
        }).filter(Boolean);

        const newTestResult = new TestResult({
            userId,
            assignmentId,
            questions
        });

        await newTestResult.save();

        assignment.attempted = true;

        res.status(200).json({
            message: 'Test results saved successfully',
            questions
        });
    } catch (error) {
        console.error('Error submitting test:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};

module.exports = {
    submitTest
};
