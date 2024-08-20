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
}= require("../controllers/result-controller.js");


//payments
const {
  verifyPayment,
  createPayment
} = require("../controllers/paymentController.js");



//s3 bucket and class with subjects 
const {
  getAllClasses,
  getSubjectsByClass,
  getChaptersBySubject,
  addClass,
  addSubject,
  addChapter,
  updateClass,
  updateSubject,
  updateChapter,
  deleteClass,
  deleteChapter,
  addVideo,
  getVideoUrl
} = require("../controllers/classcontroller.js");

router.post('/classes/:className/subjects/:subjectName/chapters/:chapterId/video', upload.single('video'), addVideo);

router.get('/classes/:className/subjects/:subjectName/chapters/:chapterId/video', getVideoUrl);

router.get('/classes', getAllClasses);
router.get('/classes/:className/subjects', getSubjectsByClass);
router.get('/classes/:className/subjects/:subjectName/chapters', getChaptersBySubject);

router.post('/classes', addClass);
router.post('/classes/:className/subjects', addSubject);
router.post('/classes/:className/subjects/:subjectName/chapters', addChapter);

router.put('/classes/:className', updateClass);
router.put('/classes/:className/subjects/:subjectId', updateSubject);
router.put('/classes/:className/subjects/:subjectName/chapters/:chapterId', updateChapter);

router.delete('/classes/:className', deleteClass);
router.delete('/classes/:className/subjects/:subjectName', deleteSubject);
router.delete('/classes/:className/subjects/:subjectName/chapters/:chapterId', deleteChapter);


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
router.get("/stats", verifyJWT, verifyAdminRole, getDashboardStats);

// Student management
router.get("/students", verifyJWT, verifyAdminRole, getStudentList);
router.put("/students/:id", verifyJWT, verifyAdminRole, updateStudent);
router.delete("/students/:id", verifyJWT, verifyAdminRole, deleteStudent);

// Teacher management
router.get("/absent-teachers", verifyJWT, verifyAdminRole, getAbsentTeachers);
router.post("/add-substitution", verifyJWT, verifyAdminRole, addSubstitution);

// Event management
router.post("/events", verifyJWT, verifyAdminRole, createEvent);
router.get("/events",verifyJWT, verifyAdminRole,  getAllEvents);
router.delete("/events/:id", verifyJWT, verifyAdminRole, deleteEvent);

// Finance management
router.post("/finances", verifyJWT, verifyAdminRole, createFinanceRecord);
router.get("/finances", verifyJWT, verifyAdminRole, getAllFinanceRecords);
router.delete("/finances/:id", verifyJWT, verifyAdminRole, deleteFinanceRecord);


//payment 
router.post('/payments/:schoolId', createPayment);
router.post('/payments/verify/:schoolId', verifyPayment);

// Admin
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



//fees details 
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
// create a new fee entry
router.get("/fees/pending", getTotalPendingFees);
router.post("/fees",createFeeWithInvoice);
router.get("/fees", getFeesWithInvoices);
router.patch("/fees/:feeId", updateFeeStatus);
router.delete("/fees/:feeId", deleteFee);
router.get("/fees/overdue", getOverdueFees);
router.get("/invoice/generate", generateInvoiceNumber);
router.get("/invoices/total",getTotalInvoices);

const {createExpense,
  getExpenses,
  getTotalExpenses,
  createRevenue,
  getRevenues,
  getTotalRevenue} = require("../controllers/revenue-expense-controllers.js");
// Expense routes
router.post("/expenses", createExpense);
router.get("/expenses", getExpenses);
router.get("/expenses/total", getTotalExpenses);

// Revenue routes
router.post("/revenues", revenueController.createRevenue);
router.get("/revenues", revenueController.getRevenues);
router.get("/revenues/total", revenueController.getTotalRevenue);
module.exports = router;
