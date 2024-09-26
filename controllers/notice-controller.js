const Notice = require("../models/noticeSchema.js");
const Teacher = require('../models/teacherSchema.js');

const noticeCreate = async (req, res) => {
  try {
    const { adminID, title, details, date } = req.body;

    const sender = await Teacher.findById(adminID);
    if (!sender || sender.role !== 'Teacher') {
      return res.status(403).json({ message: 'Only teachers are allowed to send notices' });
    }
    const notice = new Notice({
      title,
      details,
      date,
      school: sender.school,  // Assuming the teacher is associated with a school
    });

    const result = await notice.save();
    res.status(201).json(result);
  } catch (err) {
    console.error('Error creating notice:', err);
    res.status(500).json({ message: 'Internal server error', error: err });
  }
};


const noticeList = async (req, res) => {
  try {
    let notices = await Notice.find({ school: req.params.id });
    if (notices.length > 0) {
      res.send(notices);
    } else {
      res.send({ message: "No notices found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const updateNotice = async (req, res) => {
  try {
    const result = await Notice.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.send(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteNotice = async (req, res) => {
  try {
    const result = await Notice.findByIdAndDelete(req.params.id);
    res.send(result);
  } catch (error) {
    res.status(500).json(err);
  }
};

const deleteNotices = async (req, res) => {
  try {
    const result = await Notice.deleteMany({ school: req.params.id });
    if (result.deletedCount === 0) {
      res.send({ message: "No notices found to delete" });
    } else {
      res.send(result);
    }
  } catch (error) {
    res.status(500).json(err);
  }
};

module.exports = {
  noticeCreate,
  noticeList,
  updateNotice,
  deleteNotice,
  deleteNotices,
};
