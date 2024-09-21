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
const School = require("../models/schoolSchema.js");
const Finance = require("../models/financeSchema.js");
const Event = require("../models/eventSchema.js");
const Notification = require("../models/notificationSchema.js");
const AdminAccount = require("../models/adminAccount.js");



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
    const { email, password, phoneNo, schoolName, address, schoolCode, board } = req.body;

    // Validate required fields
    if (!email || !password || !phoneNo || !schoolName || !address || !schoolCode || !board) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if the email already exists
    const existingUser = await Admin.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Create the new Admin instance
    const newAdmin = new Admin({
      email,
      password, // Make sure password is hashed before saving
      phoneNo,
    });

    // Save the Admin first to generate its _id
    await newAdmin.save();

    // Create the School instance and associate it with the Admin
    const newSchool = new School({
      name: schoolName,
      address,
      schoolCode,
      board,
      admin: newAdmin._id, // Assign the newly created admin's _id to the school
    });

    // Save the School
    await newSchool.save();

    // Update Admin with the School reference
    newAdmin.school = newSchool._id;
    await newAdmin.save();

    // Respond with success message
    res.status(201).json({
      message: 'Admin and School registered successfully',
      admin: newAdmin,
      school: newSchool,
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
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

    // console.log(`Attempting to log in with email: ${email}`);
    // console.log(`Plaintext password: ${password}`);
    // console.log(`Hashed password in DB: ${user.password}`);

    const isPasswordValid = await bcrypt.compare(password, user.password);

    console.log(`Password match result: ${isPasswordValid}`);

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid password");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
    const loggedUser = await Admin.findById(user._id).select("-password -refreshToken");

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    };

    const avatarUrl = loggedUser.avatar ? loggedUser.avatar.url : "https://via.placeholder.com/200x200.png";
    const userDetails = { ...loggedUser.toJSON(), avatar: avatarUrl };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(200, { user: userDetails, accessToken, refreshToken }, "User logged in successfully"));

  } catch (err) {
    console.error('Login error:', err);
    return res
      .status(err.statusCode || 500)
      .json(new ApiResponse(err.statusCode || 500, null, err.message || "Internal Server Error"));
  }
};



// Get admin details
const getAdminDetail = async (req, res, next) => {
  try {
    // Fetch admin by ID without populating
    const admin = await Admin.findById(req.params.id)
      .select("-password -refreshToken");

    if (!admin) {
      throw new ApiError(404, "No admin found");
    }

    // Fetch the associated school
    const school = await School.findById(admin.school);
    
    if (!school) {
      throw new ApiError(404, "No school associated with this admin");
    }

    // Fetch finances, employees, students, events, notifications, and notices associated with the school
    const finances = await Finance.find({ school: school._id });
    const employees = await Teacher.find({ school: school._id });
    const students = await Student.find({ school: school._id });
    const events = await Event.find({ school: school._id });
    const notifications = await Notification.find({ school: school._id });
    const notices = await Notice.find({ school: school._id }); // Fetch notices associated with the school
    const accountDetails = await AdminAccount.findOne({ school: school._id }); // Use findOne if you expect a single document

    // Construct the response object
    const schoolResponse = {
      _id: admin._id, // Include the admin ID if needed
      email: admin.email,
      role: admin.role,
      phoneNo: admin.phoneNo,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
      school: {
        schoolName: school.name || "N/A",
        address: school.address || "N/A",
        schoolCode : school.schoolCode || "N/A",
        board : school.board || "N/A",
        phone: school.phoneNo || "N/A",
        email: admin.email || "N/A",
      
        employees: {
          teachers: employees.map(teacher => ({
            id: teacher._id,
            name: teacher.name,
            email: teacher.email,
            phoneNo: teacher.phoneNo,
            positionRole: teacher.positionrole || "N/A",
            role: teacher.role,
            teachSubject: teacher.teachSubject ? teacher.teachSubject.name : "N/A", // Assuming name is a field in Subject schema
            teachSclass: teacher.teachSclass ? teacher.teachSclass.name : "N/A", // Assuming name is a field in Sclass schema
            attendance: teacher.attendance,
            schedule: teacher.schedule,
            tempSchedule: teacher.tempSchedule,
          })) || [],
          staff: employees.filter(emp => emp.role !== "Teacher").map(staff => ({
            id: staff._id,
            name: staff.name,
            role: staff.role,
            email: staff.email,
            phone: staff.phoneNo,
          })) || []
        },
        students: students.map(student => ({
          id: student._id,
          name: student.name,
          rollNum: student.rollNum,
          gender: student.gender,
          address: student.address,
          phoneNo: student.phoneNo,
          adharNo: student.adharNo,
          extraActivity: student.extraActivity,
          sclassName: student.sclassName,
          role: student.role,
          examResult: student.examResult,
          attendance: student.attendance,
          achievements: student.achievements,
          parentDetails: student.parentDetails,
          academicPerformance: student.academicPerformance,
        })) || [],
        finance: {
          totalIncome: finances.reduce((sum, fin) => fin.type === "Revenue" ? sum + fin.amount : sum, 0) || 0,
          totalExpense: finances.reduce((sum, fin) => fin.type === "Expense" ? sum + fin.amount : sum, 0) || 0,
          details: {
            income: finances.filter(fin => fin.type === "Revenue").map(income => ({
              source: income.description,
              amount: income.amount,
            })) || [],
            expenses: finances.filter(fin => fin.type === "Expense").map(expense => ({
              category: expense.description,
              amount: expense.amount,
            })) || []
          }
        },
        notifications: notifications.map(notification => ({
          id: notification._id,
          message: notification.message,
          date: notification.date,
          type: notification.type,
        })) || [],
        notices: notices.map(notice => ({  // Map the notices here
          id: notice._id,
          title: notice.title,
          description: notice.description,
          date: notice.createdAt, // Ensure to use createdAt for date
        })) || [],
        events: events.map(event => ({
          id: event._id,
          eventName: event.eventName || "N/A",
          eventDate: event.eventDate || "N/A",
          description: event.description,
        })) || [],
        accountDetails: accountDetails ? {
          accountNumber: accountDetails.accountNumber || "N/A",
          ifscCode: accountDetails.ifscCode || "N/A",
          bankName: accountDetails.bankName || "N/A",
          balance: accountDetails.balance || 0,
        } : null,
      },
    };

    res.status(200).json(
      new ApiResponse(200, schoolResponse, "Admin details retrieved successfully")
    );
  } catch (err) {
    return res.status(err.statusCode || 500).json(
      new ApiResponse(err.statusCode || 500, null, err.message || "Internal Server Error")
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
