// const mongoose = require("mongoose");

// const studentSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   rollNum: {
//     type: Number,
//     required: true,
//   },

//   password: {
//     type: String,
//     required: true,
//   },
//   sclassName: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Sclass",
//     required: true,
//   },
//   school: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Admin",
//     required: true,
//   },
//   role: {
//     type: String,
//     default: "Student",
//   },
//   examResult: [
//     {
//       subName: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Subject",
//       },
//       marksObtained: {
//         type: Number,
//         default: 0,
//       },
//     },
//   ],
//   attendance: [
//     {
//       date: {
//         type: Date,
//         required: true,
//       },
//       status: {
//         type: String,
//         enum: ["Present", "Absent"],
//         required: true,
//       },
//       subName: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Subject",
//         required: true,
//       },
//     },
//   ],
// });

// module.exports = mongoose.model("Student", studentSchema);

const mongoose = require("mongoose");

// Parent Details Schema
const parentDetailsSchema = new mongoose.Schema({
  fatherName: {
    type: String,
    required: true,
  },
  motherName: {
    type: String,
    required: true,
  },
  fatherPhoneNo: {
    type: String,
    required: true,
  },
  motherPhoneNo: {
    type: String,
    required: true,
  },
  occupation: {
    type: String,
    required: true,
  },
});

// Extra Activity Schema
const extraActivitySchema = new mongoose.Schema({
  field: {
    type: String,
    required: true,
  },
  activity: [
    {
      type: String,
    },
  ],
});

// Exam Result Schema
const examResultSchema = new mongoose.Schema({
  subName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
  },
  marksObtained: {
    type: Number,
    default: 0,
  },
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exam",
  },
});

// Attendance Schema
const attendanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["Present", "Absent"],
    required: true,
  },
  subName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
});

// Achievements Schema
const achievementSchema = new mongoose.Schema({
  achievementsField: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  competitionName: {
    type: String,
    required: true,
  },
});

// Academic Performance Schema
const academicPerformaceSchema = new mongoose.Schema({
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exam",
  },
  totalMarks: {
    type: Number,
    required: true,
  },
  marksObtained: {
    type: Number,
    required: true,
  },
  percentage: {
    type: Number,
    required: true,
  },
  grade: {
    type: String,
    required: true,
  },
});

// Student Schema
const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    rollNum: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phoneNo: {
      type: String,
      required: true,
    },
    adharNo: {
      type: String,
      required: true,
    },
    extraActivity: [extraActivitySchema],
    sclassName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sclass",
      required: true,
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    role: {
      type: String,
      default: "Student",
    },
    examResult: [examResultSchema],
    attendance: [attendanceSchema],
    achievements: [achievementSchema],
    parentDetails: parentDetailsSchema, // Adding parent details directly in the student schema
    academicPerformance: [academicPerformaceSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);

// const mongoose = require("mongoose");

// // Parent Details Schema
// const parentDetailsSchema = new mongoose.Schema({
//   fatherName: {
//     type: String,
//     required: true,
//   },
//   motherName: {
//     type: String,
//     required: true,
//   },
//   fatherPhoneNo: {
//     type: String,
//     required: true,
//   },
//   motherPhoneNo: {
//     type: String,
//     required: true,
//   },
//   occupation: {
//     type: String,
//     required: true,
//   },
// });

// // Extra Activity Schema
// const extraActivitySchema = new mongoose.Schema({
//   field: {
//     type: String,
//     required: true,
//   },
//   activity: [
//     {
//       type: String,
//     },
//   ],
// });

// // Exam Result Schema
// const examResultSchema = new mongoose.Schema({
//   subName: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Subject",
//   },
//   marksObtained: {
//     type: Number,
//     default: 0,
//   },
// });

// // Attendance Schema
// const attendanceSchema = new mongoose.Schema({
//   date: {
//     type: Date,
//     required: true,
//   },
//   status: {
//     type: String,
//     enum: ["Present", "Absent"],
//     required: true,
//   },
//   subName: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Subject",
//     required: true,
//   },
// });

// // Achievements Schema
// const achievementSchema = new mongoose.Schema({
//   achievementsField: {
//     type: String,
//     required: true,
//   },
//   position: {
//     type: String,
//     required: true,
//   },
//   competitionName: {
//     type: String,
//     required: true,
//   },
// });

// // Student Schema
// const studentSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   rollNum: {
//     type: Number,
//     required: true,
//   },
//   gender: {
//     type: String,
//     required: true,
//   },
//   address: {
//     type: String,
//     required: true,
//   },
//   phoneNo: {
//     type: String,
//     required: true,
//   },
//   adharNo: {
//     type: String,
//     required: true,
//   },
//   extraActivity: [extraActivitySchema],
//   sclassName: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Sclass",
//     required: true,
//   },
//   school: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Admin",
//     required: true,
//   },
//   role: {
//     type: String,
//     default: "Student",
//   },
//   examResult: [examResultSchema],
//   attendance: [attendanceSchema],
//   achievements: [achievementSchema],
// });

// module.exports = mongoose.model("Student", studentSchema);
