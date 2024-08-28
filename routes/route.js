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
  academicPerformance,
  newStudentRegistration,
  newstudentLogIn,
  filterStudents,
  getAllStudents
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
  submitTest,
  getClassResultAnalysis
}= require("../controllers/result-controller.js")

const {
  fetchTranscriptText,
  askAI,
  fetchVideoByTopic
} = require("../controllers/ai-tutor-controller.js");

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

const{
  addAssignmentByTeacher,
  pendingAssignment,
}= require("../controllers/assignment-controller.js");

const {
  updateFeeStatus,
  deleteFee,
  getOverdueFees,
  getTotalPendingFees,
  generateInvoiceNumber,
  createFeeWithInvoice,
  getFeesWithInvoices,
  getTotalInvoices
} = require("../controllers/studentFees-controller.js");

const {createExpense,
  getExpenses,
  getTotalExpenses,
  createRevenue,
  getRevenues,
  getTotalRevenue} = require("../controllers/revenue-expense-controllers.js");

//dashboard
const {
  getDashboardStats,
  getStudentList,
  updateStudent,
  deleteStudent,
  getAbsentTeachers,
  addSubstitution,
  createEvent,
  getAllEvents,
  deleteEvent,
  createFinanceRecord,
  getAllFinanceRecords,
  deleteFinanceRecord,
} = require("../controllers/dashboard-controller");

// Dashboard routes
router.get("/stats", getDashboardStats);

// Student management
router.get("/students", getStudentList);
router.put("/students/:id", updateStudent);
router.delete("/students/:id", deleteStudent);

// Teacher management
router.get("/absent-teachers", getAbsentTeachers);
router.post("/add-substitution", addSubstitution);

// Event management
router.post("/events", createEvent);
router.get("/events",  getAllEvents);
router.delete("/events/:id", deleteEvent);


// Finance management
router.post("/finances", createFinanceRecord);
router.get("/finances", getAllFinanceRecords);
router.delete("/finances/:id", deleteFinanceRecord);

// Admin

router.get("/",(req,res)=>{
  res.send("working date 26 aug test");
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

// router.post("/AdminLogout", adminLogout);

router.get("/findavailableTeacher", findAvailableTeachers);

router.post("/createExam", verifyJWT, createExam);

// Student

router.post("/StudentReg/:id", verifyJWT, studentRegister);
router.post("/StudentLoginWithEmail", newstudentLogIn);

// router.post("/StudentLogin", studentLogIn);

router.get("/StudentsById/:id", getStudentById);
router.get('/allstudents', getAllStudents);
router.get('/filterstudents', filterStudents);
router.post("/getAllStudentByClassAndSection/:schoolid",getStudentsByClassAndSection);

router.put("/addStudentAchievements/:studentId", addStudentAchievement);

router.put("/markStudentAttendance", markAttendance);

router.put("/markAttendanceWithKey", markAttendanceWithAccessKey);

router.get("/getStudentAttendance", getStudentAttendance);

router.get("/getStudentAchievement/:studentId", getStudentAchievement);

router.get("/academicPerformance/:studentId", academicPerformance);

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
router.get('/class/:classId/analysis', getClassResultAnalysis);


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


//assignment by teacher
router.post('/addAssignmentByTeacher', addAssignmentByTeacher);
router.get('/pendingAssignment/:classId', pendingAssignment);

//fees details 

// create a new fee entry
router.get("/fees/pending", getTotalPendingFees);
router.post("/fees",createFeeWithInvoice);
router.get("/fees", getFeesWithInvoices);
router.patch("/fees/:feeId", updateFeeStatus);
router.delete("/fees/:feeId", deleteFee);
router.get("/fees/overdue", getOverdueFees);
router.get("/invoice/generate", generateInvoiceNumber);
router.get("/invoices/total",getTotalInvoices);


// Expense routes
router.post("/expenses", createExpense);
router.get("/expenses", getExpenses);
router.get("/expenses/total", getTotalExpenses);

// Revenue routes
router.post("/revenues", createRevenue);
router.get("/revenues", getRevenues);
router.get("/revenues/total", getTotalRevenue);

//ai-tutor
router.post('/fetch-transcript', fetchTranscriptText);
router.post('/ask-ai', askAI);
router.get('/fetch-video/:topic', fetchVideoByTopic);

module.exports = router;
