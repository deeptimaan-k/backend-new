const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    subName: {
      type: String,
      required: true,
    },
    subCode: {
      type: String,
      required: true,
    },
    sessions: {
      type: String,
      required: true,
    },
    sclass: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sclass",
      required: true,
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subject", subjectSchema);

// const mongoose = require("mongoose");

// const subjectSchema = new mongoose.Schema(
//   {
//     subName: {
//       type: String,
//       required: true,
//     },
//     subCode: {
//       type: String,
//       required: true,
//     },
//     sessions: {
//       type: String,
//       required: true,
//     },
//     sclass: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Sclass",
//       required: true,
//     },
//     school: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Admin",
//       required: true,
//     },
//     teacher: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Teacher",
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Subject", subjectSchema);
