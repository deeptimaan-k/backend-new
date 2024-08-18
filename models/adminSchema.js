// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
// const adminSchema = new mongoose.Schema({
//   avatar: {
//     type: {
//       url: String,
//       localPath: String,
//     },
//     default: {
//       url: `https://via.placeholder.com/200x200.png`,
//       localPath: "",
//     },
//   },
//   name: {
//     type: String,
//     required: true,
//   },

//   email: {
//     type: String,
//     unique: true,
//     required: true,
//   },
//   password: {
//     type: String,
//     required: [true, "Password is required"],
//   },
//   role: {
//     type: String,
//     default: "Admin",
//   },
//   schoolName: {
//     type: String,
//     unique: true,
//     required: true,
//   },
// });

// adminSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });
// adminSchema.methods.isPasswordCorrect = async function (password) {
//   return await bcrypt.compare(password, this.password);
// };

// module.exports = mongoose.model("admin", adminSchema);

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const adminSchema = new mongoose.Schema(
  {
    // avatar: {
    //   type: {
    //     url: String,
    //     localPath: String,
    //   },
    //   default: {
    //     url: {
    //       type: String,
    //       default: "https://th.bing.com/th/id/OIP.6aC0OplfDDYxuoEGXj3k_gHaHa?rs=1&pid=ImgDetMain",
    //     },
    //   url: {
    //     type: String,
    //     default: "https://via.placeholder.com/200x200.png",
    //   },
    //   localPath: {
    //     type: String,
    //     default: "",
    //   },
    // },
    schoolName: {
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
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      default: "Admin",
    },
    board: {
      type: String,
      required: true,
    },
    schoolCode: {
      type: String,
      unique: true,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    phoneNo: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordExpiry: {
      type: Date,
    },
  },
  { timestamps: true }
);

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

adminSchema.methods.isPasswordCorrect = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  console.log(`Comparing password: ${password} with hashed password: ${this.password}`);
  console.log(`Password match: ${isMatch}`);
  return isMatch;
};


adminSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      schoolName: this.schoolName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

adminSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

module.exports = mongoose.model("Admin", adminSchema);
