
const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Student'
  },
  type: {
    type: String,
    required: true
  },
  issuedDate: {
    type: Date,
    required: true
  }
});

const Certificate = mongoose.model('Certificate', certificateSchema);

module.exports = Certificate;