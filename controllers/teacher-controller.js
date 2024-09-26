// const bcrypt = require("bcrypt");
const Teacher = require("../models/teacherSchema.js");
const Subject = require("../models/subjectSchema.js");
const { ApiResponse } = require("../utils/ApiResponse.js");
// const { sendOtpThroughMail } = require("../service/sendMail.js");
const Sclass = require("../models/sclassSchema.js");
const nodemailer = require("nodemailer");
const { ApiError } = require("../utils/ApiError.js");
const Student = require("../models/studentSchema.js");
const Exam = require("../models/examSchema.js");
// Register teacher (only admin)
// const teacherRegister = async (req, res) => {
//   const { name, email, role, school, teachSubject, teachSclass, phoneNo } =
//     req.body;
//   try {
//     // const salt = await bcrypt.genSalt(10);
//     // const hashedPass = await bcrypt.hash(password, salt);

//     const teacher = new Teacher({
//       name,
//       email,
//       // password: hashedPass,
//       phoneNo,
//       role,
//       school,
//       teachSubject,
//       teachSclass,
//     });

//     const existingTeacherByEmail = await Teacher.findOne({ email });

//     if (existingTeacherByEmail) {
//       return res
//         .status(400)
//         .send(new ApiResponse(400, null, "Email already exists"));
//       // throw new ApiError(400, "Email already exists");
//     } else {
//       const result = await teacher.save();
//       await Subject.findByIdAndUpdate(teachSubject, { teacher: teacher._id });
//       result.password = undefined;
//       return res
//         .status(201)
//         .send(new ApiResponse(201, result, "Teacher registered successfully"));
//     }
//   } catch (err) {
//     return res
//       .status(500)
//       .json(new ApiResponse(500, "Internal Server Error", [err.message]));
//   }
// };

const teacherRegister = async (req, res, next) => {
  const { name, email, role, school, teachSubject, teachSclass, phoneNo } =
    req.body;

  try {
    // const salt = await bcrypt.genSalt(10);
    // const hashedPass = await bcrypt.hash(password, salt);

    const teacher = new Teacher({
      name,
      email,
      // password: hashedPass,
      phoneNo,
      role,
      school,
      teachSubject,
      teachSclass,
    });

    const existingTeacherByEmail = await Teacher.findOne({ email });

    if (existingTeacherByEmail) {
      // return res
      //   .status(400)
      //   .send(new ApiResponse(400, null, "Email already exists"));
      throw new ApiError(400, "Email already exists");
    } else {
      const result = await teacher.save();
      await Subject.findByIdAndUpdate(teachSubject, { teacher: teacher._id });
      result.password = undefined;
      return res
        .status(201)
        .send(new ApiResponse(201, result, "Teacher registered successfully"));
    }
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

// teacher login with otp
const teacherLogInWithEmail = async (req, res, next) => {
  try {
    console.log("Request body:", req.body); // Add this line to inspect the request body

    const { email } = req.body; // Destructure `email` from req.body

    if (!email) {
      // return res
      //   .status(400)
      //   .json(new ApiResponse(400, null, "Email is required"));
      throw new ApiError(404, "Email is required");
    }

    // Check if teacher exists
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      // return res
      //   .status(404)
      //   .json(new ApiResponse(404, null, "Teacher not found"));
      throw new ApiError(404, "Teacher not found");
    }

    console.log(teacher);

    // Generate OTP and save it
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    teacher.otp = otp;
    await teacher.save();

    console.log();

    // Send OTP through email
    // await sendOtpThroughMail(teacher.email, otp);
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: "denis.mohr61@ethereal.email",
        pass: "ensKdgwBcFCvAPEMKy",
      },
    });
    let info = await transporter.sendMail({
      from: '"Sheshya" <denis.mohr61@ethereal.email>',
      to: email,
      subject: "Verify your Account",
      text: `Your OTP is ${otp}`,
    });
    // Respond to client
    return res
      .status(200)
      .json(new ApiResponse(200, null, "OTP sent to email"));
  } catch (error) {
    // Handle unexpected errors
    console.error("Error during login with email:", error);
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

// Verify OTP
const verifyEmailOtp = async (req, res, next) => {
  const { email, otp } = req.body;
  console.log(req.body, email);
  try {
    const teacher = await Teacher.findOne({ email });
    if (!teacher || teacher.otp !== otp) {
      console.log(`teacher otp is not valide teacher.otp is ${teacher.otp}`);
      // throw new ApiError(400, "Invalid OTP");
      return res.status(400).send(new ApiError(400, "Invalid OTP"));
    }

    teacher.otp = undefined;
    await teacher.save();

    teacher.password = undefined;

    return res
      .status(200)
      .send(new ApiResponse(200, teacher, "OTP verified successfully"));
  } catch (error) {
    console.log(error);
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

// Get teacher details by ID
// const getTeacherDetail = async (req, res) => {
//   try {
//     const teacher = await Teacher.findById(req.params.id)
//       .populate("teachSubject", "subName sessions")
//       .populate("school", "schoolName")
//       .populate("teachSclass", "sclassName");
//     if (teacher) {
//       teacher.password = undefined;
//       return res
//         .status(200)
//         .send(
//           new ApiResponse(200, teacher, "Teacher details fetched successfully")
//         );
//     } else {
//       throw new ApiError(404, "Teacher not found");
//     }
//   } catch (err) {
//     return res
//       .status(500)
//       .json(new ApiResponse(500, "Internal Server Error", [err.message]));
//   }
// };
//new get teacher details by id
const getTeacherDetails = async (req, res, next) => {
  try {
    const teacher = await Teacher.findById(req.params.id)
      .populate("teachSubject", "subName")
      .populate("school", "schoolName")
      .populate("teachSclass", "sclassName section")
      .populate("schedule.subject", "subName")
      .populate("schedule.className", "sclassName section")
      .populate("tempSchedule.className")
      .exec();

    if (!teacher) {
      throw new ApiError(404, "Teacher not found");
    }

    teacher.password = undefined;
    return res
      .status(200)
      .send(
        new ApiResponse(200, teacher, "Teacher details fetched successfully")
      );
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

// Update teacher details
const updateTeacherDetail = async (req, res, next) => {
  const { name, email, role, teachSubject, teachSclass } = req.body;
  try {
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      { name, email, role, teachSubject, teachSclass },
      { new: true }
    )
      .populate("teachSubject", "subName sessions")
      .populate("school", "schoolName")
      .populate("teachSclass", "sclassName");

    if (updatedTeacher) {
      updatedTeacher.password = undefined;
      return res
        .status(200)
        .send(
          new ApiResponse(200, updatedTeacher, "Teacher updated successfully")
        );
    } else {
      throw new ApiError(404, "Teacher not found");
    }
  } catch (error) {
    res
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

// Delete teacher by ID
const deleteTeacher = async (req, res, next) => {
  try {
    const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id);
    if (deletedTeacher) {
      await Subject.updateOne(
        { teacher: deletedTeacher._id },
        { $unset: { teacher: 1 } }
      );
      return res
        .status(200)
        .send(
          new ApiResponse(200, deletedTeacher, "Teacher deleted successfully")
        );
    } else {
      throw new ApiError(404, "Teacher not found");
    }
  } catch (error) {
    res
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

// Teacher attendance
const teacherAttendance = async (req, res, next) => {
  const { status, date } = req.body;
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      throw new ApiError(404, "Teacher not found");
    }

    const existingAttendance = teacher.attendance.find(
      (a) => a.date.toDateString() === new Date(date).toDateString()
    );

    if (existingAttendance) {
      existingAttendance.status = status;
    } else {
      teacher.attendance.push({ date, status });
    }

    const result = await teacher.save();
    return res
      .status(200)
      .send(new ApiResponse(200, result, "Attendance updated successfully"));
  } catch (error) {
    res
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

// Get all classes of a teacher based on day like monday,tuesday like that
const getAllClassesOfTeacher = async (req, res, next) => {
  const { day } = req.body; // Expecting the day to be passed inside body

  try {
    const teacher = await Teacher.findById(req.params.id)
      .populate({
        path: "schedule.className",
        select: "sclassName section",
        match: { "schedule.day": day }, // Filter the schedule based on the day
      })
      .exec();

    if (!teacher) {
      // return res.status(400).send(new ApiError(404, "Teacher not found"));
      throw new ApiError(404, "Teacher not found");
    }

    // Filter the schedule to include only the entries for the specified day
    const scheduleForDay = teacher.schedule.filter(
      (schedule) => schedule.day === day
    );

    return res
      .status(200)
      .send(
        new ApiResponse(200, scheduleForDay, "Classes fetched successfully")
      );
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(
          error.statusCode || 500,
          null,
          error.message || "Internal Server Error"
        )
      );
  }
};

const storeTeacherBasicDetails = async (req, res, next) => {
  const { teacherId, classDetails, section, role, schedule } = req.body;

  try {
    // Find the teacher by ID
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      throw new ApiError(404, "Teacher not found");
    }

    // Find the class
    const sclass = await Sclass.findOne({ sclassName: classDetails, section });
    if (!sclass) {
      throw new ApiError(404, "Class not found");
    }

    // Validate and transform schedule
    const updatedSchedule = [];
    for (const item of schedule) {
      console.log(item);
      const classObj = await Sclass.findOne({
        sclassName: item.className,
        section: item.section,
      });
      const subjectObj = await Subject.findOne({ subName: item.subject });

      if (!classObj) {
        throw new ApiError(404, `Invalid class in schedule for ${item.day}`);
      }
      if (!subjectObj) {
        throw new ApiError(404, `Invalid subject in schedule for ${item.day}`);
      }

      // Create a new schedule entry with ObjectIds
      updatedSchedule.push({
        day: item.day,
        className: classObj._id,
        section: item.section,
        subject: subjectObj._id,
        timing: item.timing,
        duration: item.duration,
      });
    }

    // Update teacher details
    teacher.teachSclass = sclass._id;
    teacher.positionrole = role;
    teacher.schedule = updatedSchedule;

    await teacher.save();

    const updatedTeacher = await Teacher.findById(teacherId)
      .populate("teachSclass", "sclassName section")
      .populate("teachSubject", "subName")
      .exec();

    return res
      .status(200)
      .send(
        new ApiResponse(
          200,
          updatedTeacher,
          "Teacher details updated successfully"
        )
      );
  } catch (error) {
    console.error("Error updating teacher details:", error); // Log error for debugging
    return res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(
          error.statusCode || 500,
          null,
          error.message || "Internal Server Error"
        )
      );
  }
};

// Get teacher schedule by ID
const getTeacherScheduleById = async (req, res, next) => {
  try {
    const teacher = await Teacher.findById(req.params.id)
      .populate("schedule.subject", "subName")
      .populate("schedule.className", "sclassName section")
      .exec();

    if (!teacher) {
      // return res.status(400).send(new ApiError(404, "Teacher not found"));
      throw new ApiError(404, "Teacher not found");
    }

    return res
      .status(200)
      .send(
        new ApiResponse(200, teacher.schedule, "Schedule fetched successfully")
      );
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(
          error.statusCode || 500,
          null,
          "Internal Server Error"
        )
      );
  }
};
const uploadMarks = async (req, res, next) => {
  try {
    const { examId, marks, teacherId } = req.body;

    // Validate examId and teacherId
    const exam = await Exam.findOne({ _id: examId, teacherId });
    if (!exam) {
      // return res.status(404).json({
      //   message: `Exam with ID ${examId} not found or you are not authorized to update marks for this exam`,
      // });
      throw new ApiError(
        404,
        `Exam with ID ${examId} not found or you are not authorized to update marks for this exam`
      );
    }

    for (const mark of marks) {
      const { studentId, marksObtained } = mark;

      // Validate studentId
      const student = await Student.findById(studentId);
      if (!student) {
        // return res
        //   .status(404)
        //   .json({ message: `Student with ID ${studentId} not found` });
        throw new ApiError(404, `Student with ID ${studentId} not found`);
      }

      // Check if the student already has results for this exam and subject
      const existingResultIndex = student.examResult.findIndex(
        (result) =>
          result.exam.toString() === examId.toString() &&
          result.subName.toString() === exam.subjectId.toString()
      );

      if (existingResultIndex !== -1) {
        // Update existing result
        student.examResult[existingResultIndex].marksObtained = marksObtained;
      } else {
        // Add new result
        student.examResult.push({
          subName: exam.subjectId,
          marksObtained,
          exam: examId,
        });
      }

      // Save the student document
      await student.save();
    }

    // res.status(200).json({ message: "Marks uploaded successfully" });
    res
      .status(200)
      .json(new ApiResponse(200, null, "Marks uploaded successfully"));
  } catch (error) {
    res
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

const getExamByTeacherId = async (req, res, next) => {
  try {
    const { teacherId } = req.params;

    const exams = await Exam.find({ teacherId })
      .populate("subjectId", "subName")
      .populate("classId", "sclassName section")
      .select("examName totalMarks subjectId classId");

    if (!exams || exams.length === 0) {
      // return res
      //   .status(404)
      //   .json({ message: "No exams found for this teacher" });
      throw new ApiError(404, "No exams found for this teacher");
    }

    // Map the exams to include the required fields in the response
    const examList = exams.map((exam) => ({
      subjectName: exam.subjectId.subName,
      examName: exam.examName,
      totalMarks: exam.totalMarks,
      examId: exam._id,
      classId: exam.classId._id,
      className: exam.classId.sclassName,
      section: exam.classId.section,
    }));

    // res
    //   .status(200)
    //   .json({ message: "Exams retrieved successfully", exams: examList });
    res
      .status(200)
      .json(new ApiResponse(200, examList, "Exams retrieved successfully"));
  } catch (error) {
    res
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

const getAllTeacherDetails = async (req, res) => {
  try {
    const teachers = await Teacher.find()     // Populate school details
      .exec();

    // if (!teachers || teachers.length === 0) {
    //   return res.status(404).json({
    //     message: "No teachers found",
    //     success: false,
    //     error: error.message
    //   });
    // }

    res.status(200).json({
      message: "Teachers fetched successfully",
      teachers,
      success: true
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
      success: false
    });
  }
};



module.exports = {
  storeTeacherBasicDetails,
  teacherRegister,
  teacherLogInWithEmail,
  verifyEmailOtp,
  getTeacherDetails,
  updateTeacherDetail,
  deleteTeacher,
  teacherAttendance,
  getAllClassesOfTeacher,
  storeTeacherBasicDetails,
  getTeacherScheduleById,
  uploadMarks,
  getExamByTeacherId,
  getAllTeacherDetails
};
