const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["Teacher", "Admin", "Staff"],
      trim: true,
    },
    subject: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid email",
      ],
      trim: true,
    },
    phone: {
      type: String,
      match: [/^\d{10}$/, "Invalid phone number"],
      trim: true,
    },
    school: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "School", 
        required: true, 
    },
  },
  {
    timestamps: true,
  }
);

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;