const mongoose = require("mongoose");

const accessKeySchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    className: {
      type: String,
      required: true,
    },
    section: {
      type: String,
      required: true,
    },
    accessKey: {
      type: String,
      required: true,
      unique: true,
    },
    validUntil: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AccessKey", accessKeySchema);
