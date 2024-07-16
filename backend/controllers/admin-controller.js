const bcrypt = require("bcryptjs");
const Admin = require("../models/adminSchema.js");
const Sclass = require("../models/sclassSchema.js");
const Student = require("../models/studentSchema.js");
const Teacher = require("../models/teacherSchema.js");
const Subject = require("../models/subjectSchema.js");
const Notice = require("../models/noticeSchema.js");
const Complain = require("../models/complainSchema.js");
const { ApiResponse } = require("../utils/ApiResponse.js");
const { ApiError } = require("../utils/ApiError.js");

// const adminRegister = async (req, res) => {
//     try {
//         const salt = await bcrypt.genSalt(10);
//         const hashedPass = await bcrypt.hash(req.body.password, salt);

//         const admin = new Admin({
//             ...req.body,
//             password: hashedPass
//         });

//         const existingAdminByEmail = await Admin.findOne({ email: req.body.email });
//         const existingSchool = await Admin.findOne({ schoolName: req.body.schoolName });

//         if (existingAdminByEmail) {
//             res.send({ message: 'Email already exists' });
//         }
//         else if (existingSchool) {
//             res.send({ message: 'School name already exists' });
//         }
//         else {
//             let result = await admin.save();
//             result.password = undefined;
//             res.send(result);
//         }
//     } catch (err) {
//         res.status(500).json(err);
//     }
// };

// const adminLogIn = async (req, res) => {
//     if (req.body.email && req.body.password) {
//         let admin = await Admin.findOne({ email: req.body.email });
//         if (admin) {
//             const validated = await bcrypt.compare(req.body.password, admin.password);
//             if (validated) {
//                 admin.password = undefined;
//                 res.send(admin);
//             } else {
//                 res.send({ message: "Invalid password" });
//             }
//         } else {
//             res.send({ message: "User not found" });
//         }
//     } else {
//         res.send({ message: "Email and password are required" });
//     }
// };

//---------------------------------///

// code is written by Yashika
// const adminRegister = async (req, res) => {
//   try {
//     const admin = new Admin({
//       ...req.body,
//     });

//     const existingAdminByEmail = await Admin.findOne({ email: req.body.email });
//     const existingSchool = await Admin.findOne({
//       schoolName: req.body.schoolName,
//     });

//     if (existingAdminByEmail) {
//       res.send({ message: "Email already exists" });
//     } else if (existingSchool) {
//       res.send({ message: "School name already exists" });
//     } else {
//       let result = await admin.save();
//       result.password = undefined;
//       res.send(result);
//     }
//   } catch (err) {
//     res.status(500).json(err);
//   }
// };

// const adminLogIn = async (req, res) => {
//   if (req.body.email && req.body.password) {
//     let admin = await Admin.findOne({ email: req.body.email });
//     if (admin) {
//       if (req.body.password === admin.password) {
//         admin.password = undefined;
//         res.send(admin);
//       } else {
//         res.send({ message: "Invalid password" });
//       }
//     } else {
//       res.send({ message: "User not found" });
//     }
//   } else {
//     res.send({ message: "Email and password are required" });
//   }
// };

// const getAdminDetail = async (req, res) => {
//   try {
//     let admin = await Admin.findById(req.params.id);
//     if (admin) {
//       admin.password = undefined;
//       res.send(admin);
//     } else {
//       res.send({ message: "No admin found" });
//     }
//   } catch (err) {
//     res.status(500).json(err);
//   }
// };

// ///--------------------//
// // code written by shiv

const adminRegister = async (req, res) => {
  try {
    const admin = new Admin({
      ...req.body,
    });

    const existingAdminByEmail = await Admin.findOne({ email: req.body.email });
    const existingSchool = await Admin.findOne({
      schoolName: req.body.schoolName,
    });

    if (existingAdminByEmail) {
      throw new ApiError(400, "Email already exists");
    } else if (existingSchool) {
      throw new ApiError(400, "School name already exists");
    } else {
      await admin.save();
      const createdAdmin = await Admin.findById(admin._id).select("-password");
      if (!createdAdmin) {
        throw new ApiError(
          500,
          "Something went wrong while registering the admin"
        );
      }
      return res
        .status(201)
        .json(
          new ApiResponse(
            201,
            { admin: createdAdmin },
            "Admin registered successfully"
          )
        );
    }
  } catch (err) {
    return res
      .status(err.statusCode || 500)
      .json(
        new ApiResponse(
          err.statusCode || 500,
          null,
          err.message || "Internal Server Error"
        )
      );
  }
};

// Admin login
const adminLogIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, "Email and password are required");
    }

    const user = await Admin.findOne({ email });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid password");
    }

    const loggedUser = await Admin.findById(user._id).select("-password");

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { user: loggedUser },
          "User logged in successfully"
        )
      );
  } catch (err) {
    return res
      .status(err.statusCode || 500)
      .json(
        new ApiResponse(
          err.statusCode || 500,
          null,
          err.message || "Internal Server Error"
        )
      );
  }
};

// Get admin details
const getAdminDetail = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select("-password");
    if (!admin) {
      throw new ApiError(404, "No admin found");
    }
    res
      .status(200)
      .json(
        new ApiResponse(200, admin, "Admin details retrieved successfully")
      );
  } catch (err) {
    return res
      .status(err.statusCode || 500)
      .json(
        new ApiResponse(
          err.statusCode || 500,
          null,
          err.message || "Internal Server Error"
        )
      );
  }
};

// // const deleteAdmin = async (req, res) => {
// //     try {
// //         const result = await Admin.findByIdAndDelete(req.params.id)

// //         await Sclass.deleteMany({ school: req.params.id });
// //         await Student.deleteMany({ school: req.params.id });
// //         await Teacher.deleteMany({ school: req.params.id });
// //         await Subject.deleteMany({ school: req.params.id });
// //         await Notice.deleteMany({ school: req.params.id });
// //         await Complain.deleteMany({ school: req.params.id });

// //         res.send(result)
// //     } catch (error) {
// //         res.status(500).json(err);
// //     }
// // }

// // const updateAdmin = async (req, res) => {
// //     try {
// //         if (req.body.password) {
// //             const salt = await bcrypt.genSalt(10)
// //             res.body.password = await bcrypt.hash(res.body.password, salt)
// //         }
// //         let result = await Admin.findByIdAndUpdate(req.params.id,
// //             { $set: req.body },
// //             { new: true })

// //         result.password = undefined;
// //         res.send(result)
// //     } catch (error) {
// //         res.status(500).json(err);
// //     }
// // }

// // module.exports = { adminRegister, adminLogIn, getAdminDetail, deleteAdmin, updateAdmin };

module.exports = { adminRegister, adminLogIn, getAdminDetail };
