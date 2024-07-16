const mongoose = require("mongoose");

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
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "Teacher",
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
      required: true,
    },
    teachSubject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subject",
    },
    teachSclass: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "sclass",
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
  },
  { timestamps: true }
);

// teacherSchema.pre("save",async function (next){
//   if(!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password,10);
//   next();
// })

module.exports = mongoose.model("teacher", teacherSchema);
