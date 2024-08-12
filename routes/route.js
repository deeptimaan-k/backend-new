const router = require("express").Router();

// const { adminRegister, adminLogIn, deleteAdmin, getAdminDetail, updateAdmin } = require('../controllers/admin-controller.js');

const {
  adminRegister,
  adminLogIn,
  getAdminDetail,
  updateAdmin,
  createAccessKeyAndAssignSchedule,
  findAvailableTeachers,
  createExam,
} = require("../controllers/admin-controller.js");

const {
  sclassCreate,
  sclassList,
  deleteSclass,
  deleteSclasses,
  getSclassDetail,
  getSclassStudents,
} = require("../controllers/class-controller.js");
const {
  complainCreate,
  complainList,
} = require("../controllers/complain-controller.js");
const {
  noticeCreate,
  noticeList,
  deleteNotices,
  deleteNotice,
  updateNotice,
} = require("../controllers/notice-controller.js");
const {
  studentRegister,
  getStudentById,
  getStudentsByClassAndSection,
  addStudentAchievement,
  markAttendance,
  getStudentAttendance,
  markAttendanceWithAccessKey,
  getStudentAchievement,
} = require("../controllers/student_controller.js");
const {
  subjectCreate,
  classSubjects,
  deleteSubjectsByClass,
  getSubjectDetail,
  deleteSubject,
  freeSubjectList,
  allSubjects,
  deleteSubjects,
} = require("../controllers/subject-controller.js");
const {
  teacherRegister,
  teacherLogInWithEmail,
  getTeacherDetails,
  deleteTeacher,
  teacherAttendance,
  verifyEmailOtp,
  getAllClassesOfTeacher,
  storeTeacherBasicDetails,
  getTeacherScheduleById,
  uploadMarks,
  getExamByTeacherId,
} = require("../controllers/teacher-controller.js");
const verifyJWT = require("../middleware/authenticate.middleware.js");

const { upload } = require("../middleware/multer.middlewares.js");
const verifyAdminRole = require("../middleware/verifyAdminRole.middleware.js");

const{
  addClassSubjectChapter,
  addAssignment,
  getClassSubjectDetails,
  getAssignmentsByTopic
} = require("../controllers/ai-classroom-controller.js");

const {
  uploadNotes
} = require("../controllers/notes-controller.js");

const {
  submitTest
}= require("../controllers/result-controller.js")

const {
  sendNotification,
  getNotifications,
  markAsRead
}= require("../controllers/notification-controller.js")

const {
  applyLeave,
  getLeaves,
  updateLeaveStatus,
} = require("../controllers/leave-controller.js")

// Admin

router.get("/",(req,res)=>{
  res.send("working");
})

router.post("/AdminReg", upload.single("avatar"), adminRegister);
router.post("/AdminLogin", adminLogIn);

router.get("/GetAdminById/:id", verifyJWT, getAdminDetail);
// router.delete("/Admin/:id", deleteAdmin)

router.put("/UpdateAdmin/:id", verifyJWT, upload.single("avatar"), updateAdmin);

router.post(
  "/AssingScheduleWithAccessKey/:id",
  verifyJWT,
  createAccessKeyAndAssignSchedule
);

router.get("/findavailableTeacher", findAvailableTeachers);

router.post("/createExam", verifyJWT, createExam);

// Student

router.post("/StudentReg/:id", verifyJWT, studentRegister);

// router.post("/StudentLogin", studentLogIn);

router.get("/StudentsById/:id", getStudentById);
router.post(
  "/getAllStudentByClassAndSection/:schoolid",
  getStudentsByClassAndSection
);

router.put("/addStudentAchievements/:studentId", addStudentAchievement);

router.put("/markStudentAttendance", markAttendance);

router.put("/markAttendanceWithKey", markAttendanceWithAccessKey);

router.get("/getStudentAttendance", getStudentAttendance);

router.get("/getStudentAchievement/:studentId", getStudentAchievement);

// Teacher

router.post("/TeacherReg", verifyJWT, teacherRegister);
router.post("/TeacherLoginWithEmail", teacherLogInWithEmail);
router.post("/verifyEmailOtp", verifyEmailOtp);
router.post("/storeTeacherBasicDetails", storeTeacherBasicDetails);

// router.get("/Teachers/:id", getTeachers);
router.get("/Teacher/:id", getTeacherDetails);
// get teacher all class on the basis of day like Monday,tuesday like that
router.post("/getAllTeacherClass/:id", getAllClassesOfTeacher);

router.get("/getTeacherSheduleById/:id", getTeacherScheduleById);
router.post("/uploadExamMarks", uploadMarks);
router.get("/examListbyTeachId/:teacherId", getExamByTeacherId);

// router.delete("/Teachers/:id", deleteTeachers);
// router.delete("/TeachersClass/:id", deleteTeachersByClass);
router.delete("/Teacher/:id", deleteTeacher);

// router.put("/TeacherSubject", updateTeacherSubject);

router.post("/TeacherAttendance/:id", teacherAttendance);

// Notice

router.post("/NoticeCreate", noticeCreate);

router.get("/NoticeList/:id", noticeList);

router.delete("/Notices/:id", deleteNotices);
router.delete("/Notice/:id", deleteNotice);

router.put("/Notice/:id", updateNotice);

// Complain

router.post("/ComplainCreate", complainCreate);

router.get("/ComplainList/:id", complainList);

// Sclass

router.post("/SclassCreate", verifyJWT, sclassCreate);

router.get("/SclassList/:id", sclassList);
router.get("/Sclass/:id", getSclassDetail);

router.get("/Sclass/Students/:id", getSclassStudents);

router.delete("/Sclasses/:id", deleteSclasses);
router.delete("/Sclass/:id", deleteSclass);

// Subject

router.post("/SubjectCreate", subjectCreate);

router.get("/AllSubjects/:id", allSubjects);
router.get("/ClassSubjects/:id", classSubjects);
router.get("/FreeSubjectList/:id", freeSubjectList);
router.get("/Subject/:id", getSubjectDetail);

router.delete("/Subject/:id", deleteSubject);
router.delete("/Subjects/:id", deleteSubjects);
router.delete("/SubjectsClass/:id", deleteSubjectsByClass);

//AI classroom 

// router.get('/:class/:subject', getClassData);
// router.get('/:class/:subject/:chapter/:topic/assignments', getAssignments);
// router.post('/addClass',addClassroom);
router.post('/classroom', addClassSubjectChapter);

// Route to add assignment
router.post('/assignment', addAssignment);
router.get('/classroom/:class/:subject', getClassSubjectDetails);
router.get('/classroom/:className/:subject/:chapter/:topic/assignments', getAssignmentsByTopic);


//assignment submit
router.post('/assignment/submit', submitTest);

//notes upload
router.post('/uploadNotes', uploadNotes);

//notification
router.post('/sendNotification', sendNotification);
router.get('/getNotification/:id', getNotifications);
router.put('/markAsRead/:id', markAsRead);


//attendance

router.post('/applyLeave', applyLeave);
router.get('/getLeaves/:studentId', getLeaves);
router.put('/updateLeaveStatus/:id', updateLeaveStatus);

module.exports = router;
