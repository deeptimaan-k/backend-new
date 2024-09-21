const mongoose = require('mongoose');

// Define the school schema
const schoolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
  },
  schoolCode: {
    type: String,
    required: true,
    unique: true,
  },
  board: {
    type: String,
    required: true,
    enum: ['CBSE', 'ICSE', 'State Board', 'Other'],  // You can add more board types as needed
  },
  admin : {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required : true,
  },
  finances: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Finance'
    }
  ],
  employees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee'
    }
  ],
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    }
  ],
  events: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'
    }
  ],
  notifications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Notifications'
    }
  ],
  certificates: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Certificate'
    }
  ],

  
}, { timestamps: true });

// Create the School model
const School = mongoose.model('School', schoolSchema);

module.exports = School;