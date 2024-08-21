const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
  },
  phoneNo: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  position: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
  },
  hireDate: {
    type: Date,
    required: true,
  },
  salary: {
    type: Number,
    required: true,
  },
  employmentStatus: {
    type: String,
    enum: ['Active', 'Inactive', 'On Leave'],
    default: 'Active',
  },
  emergencyContact: {
    name: {
      type: String,
    },
    phoneNo: {
      type: String,
    },
  },
  profilePicture: {
    url: {
      type: String,
    },
    localPath: {
      type: String,
    },
  },
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
