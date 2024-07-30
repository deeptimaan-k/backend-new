const Sclass = require("../models/sclassSchema.js");
const Student = require("../models/studentSchema.js");

const markAttendanceService = async ({
  teacher,
  presentStudentIds,
  className,
  section,
  date,
}) => {
  // Find the class
  const studentClass = await Sclass.findOne({
    sclassName: className,
    section: section,
  });

  if (!studentClass) {
    throw new Error("Class not found");
  }

  // Find students in the specified class and section
  const students = await Student.find({
    sclassName: studentClass._id.toString(),
  });

  if (students.length === 0) {
    throw new Error("No students found for this class and section");
  }

  // Create a map for quick lookup of present students
  const presentStudentMap = new Set(presentStudentIds);

  // Update attendance records for each student
  for (const student of students) {
    const status = presentStudentMap.has(student._id.toString())
      ? "Present"
      : "Absent";

    // Check if attendance for the same date and subject already exists
    const existingAttendance = student.attendance.find(
      (att) =>
        att.date.toISOString() === new Date(date).toISOString() &&
        att.subName.toString() === teacher.teachSubject._id.toString()
    );

    if (!existingAttendance) {
      student.attendance.push({
        date: new Date(date),
        status,
        subName: teacher.teachSubject._id, // Assuming teacher.teachSubject is used to record subject attendance
      });
      await student.save();
    }
  }

  return { message: "Attendance marked successfully" };
};

module.exports = markAttendanceService;
