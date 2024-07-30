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
const { upload } = require("../middleware/multer.middlewares.js");
const { generateToken, verifyToken } = require("../utils/jwt.js");
const AccessKey = require("../models/accessKeySchema.js");
const generateAccessKey = require("crypto").randomBytes;
const markAttendanceService = require("../service/markAttendanceService.js");
const Exam = require("../models/examSchema.js");

// // code written by shiv

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await Admin.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // attach refresh token to the user document to avoid refreshing the access token with multiple refresh tokens
    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating the access token"
    );
  }
};

const adminRegister = async (req, res, next) => {
  try {
    const avatar = req.file
      ? {
          url: `/images/${req.file.filename}`,
          localPath: req.file.path,
        }
      : undefined;
    const admin = new Admin({
      ...req.body,
      avatar,
    });

    const existingAdminByEmail = await Admin.findOne({ email: req.body.email });
    const existingSchool = await Admin.findOne({
      schoolName: req.body.schoolCode,
    });

    if (existingAdminByEmail) {
      throw new ApiError(400, "Email already exists");
    } else if (existingSchool) {
      throw new ApiError(400, "School code already exists");
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
const adminLogIn = async (req, res, next) => {
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

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );
    const loggedUser = await Admin.findById(user._id).select(
      "-password -refreshToken"
    );

    // TODO: Add more options to make cookie more secure and reliable
    const options = {
      httpOnly: true,
      secure: true,
    };

    const avatarUrl = loggedUser.avatar
      ? loggedUser.avatar.url
      : "https://via.placeholder.com/200x200.png";
    const userDetails = {
      ...loggedUser.toJSON(),
      avatar: avatarUrl,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options) // set the access token in the cookie
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { user: userDetails, accessToken, refreshToken }, // send access and refresh token in response if client decides to save them by themselves
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
const getAdminDetail = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.params.id).select(
      "-password --refreshToken"
    );
    if (!admin) {
      throw new ApiError(404, "No admin found");
    }
    // Ensure avatar URL is correctly handled
    const avatarUrl = admin.avatar
      ? admin.avatar.url
      : "https://via.placeholder.com/200x200.png";
    const adminDetails = {
      ...admin.toJSON(),
      avatar: avatarUrl,
    };
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          adminDetails,
          "Admin details retrieved successfully"
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

const updateAdmin = async (req, res, next) => {
  try {
    const adminId = req.params.id;
    const updateData = req.body;

    // Check if a new avatar file is uploaded
    if (req.file) {
      updateData.avatar = {
        url: `/images/${req.file.filename}`,
        localPath: req.file.path,
      };
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(adminId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password -refreshToken");

    if (!updatedAdmin) {
      throw new ApiError(404, "Admin not found");
    }

    const avatarUrl = updatedAdmin.avatar
      ? updatedAdmin.avatar.url
      : "https://via.placeholder.com/200x200.png";
    const adminDetails = {
      ...updatedAdmin.toJSON(),
      avatar: avatarUrl,
    };

    return res
      .status(200)
      .json(
        new ApiResponse(200, adminDetails, "Admin details updated successfully")
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

const createAccessKeyAndAssignSchedule = async (req, res, next) => {
  try {
    const { teacherId, className, section, subject, date, timing, duration } =
      req.body;

    const schoolid = req.params.id;

    // Validate input
    if (
      !teacherId ||
      !className ||
      !section ||
      !subject ||
      !date ||
      !timing ||
      !duration
    ) {
      // return res.status(400).json({ message: "All fields are required" });
      throw new ApiError(400, "All fields are required");
    }

    // Find the teacher
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      // return res.status(404).json({ message: "Teacher not found" });
      throw new ApiError(404, "Teacher not found");
    }

    // Log the values being queried
    console.log(`Querying Sclass with:`, {
      className,
      section,
      school: teacher.school.toString(),
    });

    // Find the class based on className, section, and school
    const sclass = await Sclass.findOne({
      sclassName: className,
      section,
      school: teacher.school.toString(),
    });

    // Log the result of the query
    console.log(`Sclass found:`, sclass);

    if (!sclass) {
      // return res.status(404).json({ message: "Class not found" });
      throw new ApiError(404, "class not found");
    }

    // Generate access key
    const accessKey = Math.floor(1000 + Math.random() * 9000).toString();

    // Assign temporary schedule
    teacher.tempSchedule.push({
      date: new Date(date),
      className: sclass._id,
      section,
      subject,
      timing,
      duration,
      accessKey,
      completeStatus: false,
    });

    await teacher.save();

    // res.status(200).json({
    //   message: "Access key created and schedule assigned",
    //   accessKey,
    // });
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          accessKey,
          "Access key created and schedule assigned "
        )
      );
  } catch (error) {
    // res.status(500).json({ message: "Server error", error: error.message });
    return res
      .status(500)
      .json(
        new ApiResponse(
          error.statusCode || 500,
          null,
          error.message || "Internal Server Error"
        )
      );
  }
};

const findAvailableTeachers = async (req, res, next) => {
  try {
    const { date, time } = req.query;

    // Validate input
    if (!date || !time) {
      // return res.status(400).json({ message: "Date and time are required" });
      throw new ApiError(400, "Date and time are required");
    }

    const teachers = await Teacher.find()
      .populate("schedule.className")
      .populate("schedule.subject");

    const availableTeachers = teachers.filter((teacher) => {
      const isAvailable = !teacher.schedule.some(
        (sch) =>
          sch.date.toISOString() === new Date(date).toISOString() &&
          sch.timing === time
      );
      return isAvailable;
    });

    // res.status(200).json({ availableTeachers });
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          availableTeachers,
          "successfully retrieve all available teachers"
        )
      );
  } catch (error) {
    // res.status(500).json({ message: "Server error", error: error.message });
    return res
      .status(500)
      .json(
        new ApiResponse(
          error.statusCode || 500,
          null,
          error.message || "Internal Server Error"
        )
      );
  }
};

const createExam = async (req, res, next) => {
  try {
    const {
      examName,
      totalMarks,
      subjectId,
      className,
      section,
      teacherId,
      date,
    } = req.body;

    // Find the subject, class, and section
    const subject = await Subject.findOne({ subName: subjectId });
    if (!subject)
      // return res
      //   .status(404)
      //   .json({ message: `Subject ${subjectId} not found` });
      throw new ApiError(404, `subject ${subjectId} not found`);

    const sclass = await Sclass.findOne({ sclassName: className, section });
    if (!sclass)
      // return res.status(404).json({
      //   message: `Class ${className} with section ${section} not found`,
      // });
      throw new ApiError(
        404,
        `Class ${className} with section ${section} not found`
      );

    const newExam = new Exam({
      examName,
      totalMarks,
      subjectId: subject._id,
      classId: sclass._id,
      teacherId,
      date,
    });

    await newExam.save();

    // res.status(201).json({ message: "Exam added successfully", exam: newExam });
    res
      .status(201)
      .json(new ApiResponse(201, newExam, "Exam added successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiResponse(
          error.statusCode || 500,
          null,
          error.message || "Internal Server Error"
        )
      );
  }
};

module.exports = {
  adminRegister,
  adminLogIn,
  getAdminDetail,























































































  
  updateAdmin,
  createExam,

  findAvailableTeachers,
  createAccessKeyAndAssignSchedule,
};
