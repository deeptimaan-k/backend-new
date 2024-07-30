const Subject = require("../models/subjectSchema.js");
const Teacher = require("../models/teacherSchema.js");
const Student = require("../models/studentSchema.js");
const subjectCreate = async (req, res,next) => {
  try {
    const subjects = req.body.subjects.map((subject) => ({
      subName: subject.subName,
      subCode: subject.subCode,
      sessions: subject.sessions,
      sclass: req.body.sclass, // Ensure this matches the schema field name
      school: req.body.adminID,
    }));

    // Check for existing subjects by subCode for the provided school
    const subCodes = subjects.map((subject) => subject.subCode);
    const existingSubjects = await Subject.find({
      subCode: { $in: subCodes },
      school: req.body.adminID,
    });

    if (existingSubjects.length > 0) {
      res.send({
        message: "Sorry, some subject codes already exist and must be unique.",
        existingSubjects: existingSubjects.map((subject) => subject.subCode),
      });
    } else {
      const result = await Subject.insertMany(subjects);
      res.send(result);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const allSubjects = async (req, res,next) => {
  try {
    let subjects = await Subject.find({ school: req.params.id }).populate(
      "sclassName",
      "sclassName"
    );
    if (subjects.length > 0) {
      res.send(subjects);
    } else {
      res.send({ message: "No subjects found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const classSubjects = async (req, res,next) => {
  try {
    let subjects = await Subject.find({ sclassName: req.params.id });
    if (subjects.length > 0) {
      res.send(subjects);
    } else {
      res.send({ message: "No subjects found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const freeSubjectList = async (req, res,next) => {
  try {
    let subjects = await Subject.find({
      sclassName: req.params.id,
      teacher: { $exists: false },
    });
    if (subjects.length > 0) {
      res.send(subjects);
    } else {
      res.send({ message: "No subjects found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const getSubjectDetail = async (req, res,next) => {
  try {
    let subject = await Subject.findById(req.params.id);
    if (subject) {
      subject = await subject.populate("sclassName", "sclassName");
      subject = await subject.populate("teacher", "name");
      res.send(subject);
    } else {
      res.send({ message: "No subject found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const deleteSubject = async (req, res,next) => {
  try {
    const deletedSubject = await Subject.findByIdAndDelete(req.params.id);

    // Set the teachSubject field to null in teachers
    await Teacher.updateOne(
      { teachSubject: deletedSubject._id },
      { $unset: { teachSubject: "" }, $unset: { teachSubject: null } }
    );

    // Remove the objects containing the deleted subject from students' examResult array
    await Student.updateMany(
      {},
      { $pull: { examResult: { subName: deletedSubject._id } } }
    );

    // Remove the objects containing the deleted subject from students' attendance array
    await Student.updateMany(
      {},
      { $pull: { attendance: { subName: deletedSubject._id } } }
    );

    res.send(deletedSubject);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteSubjects = async (req, res,next) => {
  try {
    const deletedSubjects = await Subject.deleteMany({ school: req.params.id });

    // Set the teachSubject field to null in teachers
    await Teacher.updateMany(
      { teachSubject: { $in: deletedSubjects.map((subject) => subject._id) } },
      { $unset: { teachSubject: "" }, $unset: { teachSubject: null } }
    );

    // Set examResult and attendance to null in all students
    await Student.updateMany(
      {},
      { $set: { examResult: null, attendance: null } }
    );

    res.send(deletedSubjects);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteSubjectsByClass = async (req, res,next) => {
  try {
    const deletedSubjects = await Subject.deleteMany({
      sclassName: req.params.id,
    });

    // Set the teachSubject field to null in teachers
    await Teacher.updateMany(
      { teachSubject: { $in: deletedSubjects.map((subject) => subject._id) } },
      { $unset: { teachSubject: "" }, $unset: { teachSubject: null } }
    );

    // Set examResult and attendance to null in all students
    await Student.updateMany(
      {},
      { $set: { examResult: null, attendance: null } }
    );

    res.send(deletedSubjects);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  subjectCreate,
  freeSubjectList,
  classSubjects,
  getSubjectDetail,
  deleteSubjectsByClass,
  deleteSubjects,
  deleteSubject,
  allSubjects,
};
