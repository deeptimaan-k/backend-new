// const mongoose = require("mongoose");

// const sclassSchema = new mongoose.Schema(
//   {
//     sclassName: {
//       type: String,
//       required: true,
//     },
//     section: {
//       type: String,
//       required: true,
//     },
//     school: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "admin",
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("sclass", sclassSchema);

const mongoose = require("mongoose");


const sclassSchema = new mongoose.Schema(
  {
    sclassName: {
      type: String,
      required: true,
    },
    section: {
      type: String,
      required: true,
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    subjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
      },
    ], // Add this line to allow population
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sclass", sclassSchema);
