const mongoose = require("mongoose");

const complainSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  complaint: {
    type: String,
    required: true,
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
    required: true,
  },
});

module.exports = mongoose.model("Complain", complainSchema);
