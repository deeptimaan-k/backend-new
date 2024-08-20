const verifyStudentSchool = async (req, res, next) => {
    try {
      console.log("Request parameters:", req.params);
      const studentId = req.params.studentId;
      if (!studentId) {
        return next(new ApiError(400, "Student ID is required"));
      }
  
      console.log("Looking for student with ID:", studentId);
      const student = await Student.findById(studentId).populate('school', '_id');
      console.log("Found student:", student);
  
      if (!student) {
        return next(new ApiError(404, "Student not found"));
      }
  
      const adminSchoolId = req.user._id; // Assuming req.user._id is the school ID stored in JWT
      if (!student.school || student.school._id.toString() !== adminSchoolId.toString()) {
        return next(new ApiError(403, "Forbidden: Access to this student's data is not allowed"));
      }
  
      req.student = student;
      next();
    } catch (error) {
      console.error("Error in verifyStudentSchool middleware:", error);
      next(error);
    }
  };
  