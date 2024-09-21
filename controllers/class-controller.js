// const Sclass = require("../models/sclassSchema.js");
// const Student = require("../models/studentSchema.js");
// const Subject = require("../models/subjectSchema.js");
// const Teacher = require("../models/teacherSchema.js");
// const { ApiResponse } = require("../utils/ApiResponse.js");

// const sclassCreate = async (req, res) => {
//   try {
//     const sclass = new Sclass({
//       sclassName: req.body.sclassName,
//       school: req.body.adminID,
//       section: req.body.section,
//     });

//     const existingSclassByName = await Sclass.findOne({
//       sclassName: req.body.sclassName,
//       school: req.body.adminID,
//       section: req.body.section,
//     });

//     if (existingSclassByName) {
//       throw new ApiError(400, "Sorry this class name already exists");
//       // res.send({ message: "Sorry this class name already exists" });
//     } else {
//       const result = await sclass.save();
//       res
//         .status(201)
//         .json(new ApiResponse(201, result, "Class created successfully"));
//     }
//   } catch (err) {
//     return res
//       .status(err.statusCode || 500)
//       .json(
//         new ApiResponse(
//           err.statusCode || 500,
//           null,
//           err.message || "Internal Server Error"
//         )
//       );
//   }
// };

// const sclassList = async (req, res) => {
//   try {
//     let sclasses = await Sclass.find({ school: req.params.id });
//     if (sclasses.length > 0) {
//       res.send(sclasses);
//       // res
//       //   .status(201)
//       //   .json(new ApiResponse(201, sclasses, "List of All the classes "));
//     } else {
//       // res.send({ message: "No sclasses found" });
//       throw new ApiResponse(400, "No sclasses found");
//     }
//   } catch (err) {
//     return res
//       .status(err.statusCode || 500)
//       .json(
//         new ApiResponse(
//           err.statusCode || 500,
//           null,
//           err.message || "Internal Server Error"
//         )
//       );
//   }
// };

// const getSclassDetail = async (req, res) => {
//   try {
//     let sclass = await Sclass.findById(req.params.id);
//     if (sclass) {
//       sclass = await sclass.populate("school", "schoolName");
//       res.send(sclass);
//     } else {
//       res.send({ message: "No class found" });
//     }
//   } catch (err) {
//     res.status(500).json(err);
//   }
// };

// const getSclassStudents = async (req, res) => {
//   try {
//     let students = await Student.find({ sclassName: req.params.id });
//     if (students.length > 0) {
//       let modifiedStudents = students.map((student) => {
//         return { ...student._doc, password: undefined };
//       });
//       res.send(modifiedStudents);
//     } else {
//       res.send({ message: "No students found" });
//     }
//   } catch (err) {
//     res.status(500).json(err);
//   }
// };

// const deleteSclass = async (req, res) => {
//   try {
//     const deletedClass = await Sclass.findByIdAndDelete(req.params.id);
//     if (!deletedClass) {
//       return res.send({ message: "Class not found" });
//     }
//     const deletedStudents = await Student.deleteMany({
//       sclassName: req.params.id,
//     });
//     const deletedSubjects = await Subject.deleteMany({
//       sclassName: req.params.id,
//     });
//     const deletedTeachers = await Teacher.deleteMany({
//       teachSclass: req.params.id,
//     });
//     res.send(deletedClass);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// };

// const deleteSclasses = async (req, res) => {
//   try {
//     const deletedClasses = await Sclass.deleteMany({ school: req.params.id });
//     if (deletedClasses.deletedCount === 0) {
//       return res.send({ message: "No classes found to delete" });
//     }
//     const deletedStudents = await Student.deleteMany({ school: req.params.id });
//     const deletedSubjects = await Subject.deleteMany({ school: req.params.id });
//     const deletedTeachers = await Teacher.deleteMany({ school: req.params.id });
//     res.send(deletedClasses);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// };

// module.exports = {
//   sclassCreate,
//   sclassList,
//   deleteSclass,
//   deleteSclasses,
//   getSclassDetail,
//   getSclassStudents,
// };

const Sclass = require("../models/sclassSchema.js");
const Student = require("../models/studentSchema.js");
const Subject = require("../models/subjectSchema.js");
const Teacher = require("../models/teacherSchema.js");
const { ApiError } = require("../utils/ApiError.js");
const { ApiResponse } = require("../utils/ApiResponse.js");

const sclassCreate = async (req, res, next) => {
  try {
    const { sclassName, school, section } = req.body;

    const existingSclass = await Sclass.findOne({
      sclassName: sclassName,
      school: school,
      section: section,
    });

    if (existingSclass) {
      throw new ApiError(400, "Class name already exists for this school and section");
    }

    const newSclass = new Sclass({
      sclassName: sclassName,
      school: school,
      section: section,
    });

    const result = await newSclass.save();

    return res.status(201).json(new ApiResponse(201, result, "Class created successfully"));
  } catch (err) {
    console.error("Error in class creation:", err); // Log error details

    return res.status(err.statusCode || 500).json(
      new ApiResponse(err.statusCode || 500, null, err.message || "Internal Server Error")
    );
  }
};


const sclassList = async (req, res, next) => {
  try {
    const sclasses = await Sclass.find({ school: req.params.id });
    if (sclasses.length > 0) {
      res
        .status(200)
        .json(new ApiResponse(200, sclasses, "List of all classes"));
    } else {
      throw new ApiError(404, "No classes found");
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

const getSclassDetail = async (req, res, next) => {
  try {
    let sclass = await Sclass.findById(req.params.id).populate(
      "school",
      "schoolName"
    );
    if (sclass) {
      return res
        .status(200)
        .json(
          new ApiResponse(200, sclass, "Class details retrieved successfully")
        );
    } else {
      throw new ApiError(404, "No class found");
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

const getSclassStudents = async (req, res, next) => {
  try {
    let students = await Student.find({ sclassName: req.params.id });
    if (students.length > 0) {
      let modifiedStudents = students.map((student) => {
        return { ...student._doc, password: undefined };
      });
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            modifiedStudents,
            "List of students in class retrieved successfully"
          )
        );
    } else {
      throw new ApiError(404, "No students found");
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

const deleteSclass = async (req, res, next) => {
  try {
    const deletedClass = await Sclass.findByIdAndDelete(req.params.id);
    if (!deletedClass) {
      throw new ApiError(404, "Class not found");
    }
    await Student.deleteMany({ sclassName: req.params.id });
    await Subject.deleteMany({ sclassName: req.params.id });
    await Teacher.deleteMany({ teachSclass: req.params.id });
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          deletedClass,
          "Class and related data deleted successfully"
        )
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

const deleteSclasses = async (req, res, next) => {
  try {
    const deletedClasses = await Sclass.deleteMany({ school: req.params.id });
    if (deletedClasses.deletedCount === 0) {
      throw new ApiError(404, "No classes found to delete");
    }
    await Student.deleteMany({ school: req.params.id });
    await Subject.deleteMany({ school: req.params.id });
    await Teacher.deleteMany({ school: req.params.id });
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          deletedClasses,
          "All classes and related data deleted successfully"
        )
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

module.exports = {
  sclassCreate,
  sclassList,
  deleteSclass,
  deleteSclasses,
  getSclassDetail,
  getSclassStudents,
};
