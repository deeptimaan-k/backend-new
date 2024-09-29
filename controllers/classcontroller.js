const Class = require('../models/classSchema');
exports.getAllClasses = async (req, res) => {
    try {
        const classes = await Class.find();
        res.status(200).json(classes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getSubjectsByClass = async (req, res) => {
    try {
        const classData = await Class.findOne({ class: req.params.className });
        if (!classData) return res.status(404).json({ message: 'Class not found' });
        res.status(200).json(classData.subjects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getChaptersBySubject = async (req, res) => {
    try {
        const classData = await Class.findOne({ class: req.params.className });
        if (!classData) return res.status(404).json({ message: 'Class not found' });

        const subject = classData.subjects.find(sub => sub.name === req.params.subjectName);
        if (!subject) return res.status(404).json({ message: 'Subject not found' });

        res.status(200).json(subject.chapters);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Add a new class
exports.addClass = async (req, res) => {
    try {
        const newClass = new Class(req.body);
        await newClass.save();
        res.status(201).json(newClass);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add a new subject to a class
exports.addSubject = async (req, res) => {
    try {
        const classData = await Class.findOne({ class: req.params.className });
        if (!classData) return res.status(404).json({ message: 'Class not found' });

        classData.subjects.push(req.body);
        await classData.save();
        res.status(201).json(classData.subjects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add a new chapter to a subject
exports.addChapter = async (req, res) => {
    try {
        const classData = await Class.findOne({ class: req.params.className });
        if (!classData) return res.status(404).json({ message: 'Class not found' });

        const subject = classData.subjects.find(sub => sub.name === req.params.subjectName);
        if (!subject) return res.status(404).json({ message: 'Subject not found' });

        subject.chapters.push(req.body);
        await classData.save();
        res.status(201).json(subject.chapters);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a class
exports.updateClass = async (req, res) => {
    try {
        const updatedClass = await Class.findOneAndUpdate(
            { class: req.params.className },
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedClass) return res.status(404).json({ message: 'Class not found' });
        res.status(200).json(updatedClass);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a subject in a class
exports.updateSubject = async (req, res) => {
    try {
        const classData = await Class.findOne({ class: req.params.className });
        if (!classData) return res.status(404).json({ message: 'Class not found' });

        const subject = classData.subjects.id(req.params.subjectId);
        if (!subject) return res.status(404).json({ message: 'Subject not found' });

        Object.assign(subject, req.body);
        await classData.save();
        res.status(200).json(subject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a chapter in a subject
exports.updateChapter = async (req, res) => {
    try {
        const classData = await Class.findOne({ class: req.params.className });
        if (!classData) return res.status(404).json({ message: 'Class not found' });

        const subject = classData.subjects.find(sub => sub.name === req.params.subjectName);
        if (!subject) return res.status(404).json({ message: 'Subject not found' });

        const chapter = subject.chapters.id(req.params.chapterId);
        if (!chapter) return res.status(404).json({ message: 'Chapter not found' });

        Object.assign(chapter, req.body);
        await classData.save();
        res.status(200).json(chapter);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a class
exports.deleteClass = async (req, res) => {
    try {
        const deletedClass = await Class.findOneAndDelete({ class: req.params.className });
        if (!deletedClass) return res.status(404).json({ message: 'Class not found' });
        res.status(200).json({ message: 'Class deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a subject from a class
exports.deleteSubject = async (req, res) => {
    try {
        const classData = await Class.findOne({ class: req.params.className });
        if (!classData) return res.status(404).json({ message: 'Class not found' });

        const subjectIndex = classData.subjects.findIndex(sub => sub.name === req.params.subjectName);
        if (subjectIndex === -1) return res.status(404).json({ message: 'Subject not found' });

        classData.subjects.splice(subjectIndex, 1);
        await classData.save();
        res.status(200).json({ message: 'Subject deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a chapter from a subject
exports.deleteChapter = async (req, res) => {
    try {
        const classData = await Class.findOne({ class: req.params.className });
        if (!classData) return res.status(404).json({ message: 'Class not found' });

        const subject = classData.subjects.find(sub => sub.name === req.params.subjectName);
        if (!subject) return res.status(404).json({ message: 'Subject not found' });

        const chapterIndex = subject.chapters.findIndex(chap => chap._id.toString() === req.params.chapterId);
        if (chapterIndex === -1) return res.status(404).json({ message: 'Chapter not found' });

        subject.chapters.splice(chapterIndex, 1);
        await classData.save();
        res.status(200).json({ message: 'Chapter deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.addVideo = async (req, res) => {
    try {
        const { className, subjectName, chapterId } = req.params;
        const videoUrl = req.file.location; // Get the video URL from S3

        // Find the class document
        const classData = await Class.findOne({ class: className });
        if (!classData) return res.status(404).json({ message: 'Class not found' });

        // Find the subject
        const subject = classData.subjects.find(sub => sub.name === subjectName);
        if (!subject) return res.status(404).json({ message: 'Subject not found' });

        // Find the chapter by id
        const chapterIndex = subject.chapters.findIndex(chap => chap._id.toString() === chapterId);
        if (chapterIndex === -1) return res.status(404).json({ message: 'Chapter not found' });

        // Update the videoUrl
        subject.chapters[chapterIndex].videoUrl = videoUrl;
        await classData.save();

        res.status(200).json({ message: 'Video uploaded successfully', videoUrl });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Get video URL for a chapter
// Fetch video URL for a specific chapter
exports.getVideoUrl = async (req, res) => {
    try {
        const { className, subjectName, chapterId } = req.params;

        // Find the class document
        const classData = await Class.findOne({ class: className });
        if (!classData) return res.status(404).json({ message: 'Class not found' });

        // Find the subject
        const subject = classData.subjects.find(sub => sub.name === subjectName);
        if (!subject) return res.status(404).json({ message: 'Subject not found' });

        // Find the chapter
        const chapter = subject.chapters.find(chap => chap._id.toString() === chapterId);
        if (!chapter) return res.status(404).json({ message: 'Chapter not found' });

        // Return the video URL
        res.status(200).json({ videoUrl: chapter.videoUrl });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
