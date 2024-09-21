const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
  },
  className: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sclass",
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  timing: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
});

const teacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    otp: {
      type: String,
    },
    phoneNo: {
      type: String,
      unique: true,
      required: true,
    },
    // password: {
    //   type: String,
    //   required: true,
    // },
    positionrole: {
      type: String,
    },

    role: {
      type: String,
      default: "Teacher",
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    teachSubject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
    teachSclass: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sclass",
      required: true,
    },
    attendance: [
      {
        date: {
          type: Date,
          required: true,
        },
        presentCount: {
          type: String,
        },
        absentCount: {
          type: String,
        },
      },
    ],
    schedule: [scheduleSchema],
    tempSchedule: [
      {
        date: {
          type: Date,
          required: true,
        },
        className: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Sclass",
          required: true,
        },
        section: {
          type: String,
          required: true,
        },
        subject: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Subject",
          required: true,
        },
        timing: {
          type: String,
          required: true,
        },
        duration: {
          type: String,
          required: true,
        },
        accessKey: {
          type: String,
          required: true,
        },
        completeStatus: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Teacher", teacherSchema);
