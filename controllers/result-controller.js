const Assignment = require("../models/assignmentSchema");
const TestResult = require("../models/resultSchema");
const axios = require('axios');

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
                question: question.question,
                userAnswer: result.userAnswer,
                correct: isCorrect,
                attempted: result.userAnswer !== null && result.userAnswer !== undefined
            };
        }).filter(Boolean);

        const newTestResult = new TestResult({
            userId,
            assignmentId,
            results: questions,
            totalMarks
        });

        await newTestResult.save();

        const analysisRequest = {
            response: results.map(result => ({
                question: result.question,
                studentAnswer: result.userAnswer,
                correctAnswer: assignment.questions.find(q => q.question === result.question)?.correct
            })).filter(item => item.question && item.studentAnswer !== undefined)
        };

        const analysisResponse = await axios.post('https://ai-qna-gvhkarb0faf3fvhs.eastus-01.azurewebsites.net/analyse/', analysisRequest);

        if (!Array.isArray(analysisResponse.data)) {
            throw new Error('Invalid response structure from AI API');
        }

        const analysisData = analysisResponse.data.map((item, index) => ({
            question: questions[index]?.question || null,
            studentAnswer: item.studentAnswer,
            correctAnswer: item.verdict === 'correct',
            advice: item.advice,
            improvement: item.improvement
        }));

        newTestResult.analyse = analysisData; 
        await newTestResult.save();

        res.status(200).json({
            message: 'Test results and analysis saved successfully',
            questions,
            totalMarks,
            analysis: analysisData
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
