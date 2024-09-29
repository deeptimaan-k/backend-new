// // const nodemailer = require("nodemailer");
// // const { ApiResponse } = require("../utils/ApiResponse.js");

// // const sendOtpThroughMail = async (req, res) => {
// //     let testAccount = await nodemailer.createTestAccount();

// //   const transporter = nodemailer.createTransport({
// //     host: "smtp.ethereal.email",
// //     port: 587,
// //     auth: {
// //       user: "therese.ratke47@ethereal.email",
// //       pass: "2G6F5hrZ2gZbFrxFVQ",
// //     },
// //   });

// //   let info = await transporter.sendMail({
// //     from: ' "Sheshya" <therese.ratke47@ethereal.email>',
// //     to: req.body.email,
// //     subject:"Verify your Account",
// //     text:"1234"
// //   });
// //   new ApiResponse(201,info,"Mail sent Successfully");
// // };

// // module.exports = sendMail;

// const nodemailer = require("nodemailer");
// const { ApiResponse } = require("../utils/ApiResponse");
// const { ApiError } = require("../utils/ApiError");

// const sendOtpThroughMail = async (req, res) => {
//   const { email, otp } = req.body;

//   try {
//     const transporter = nodemailer.createTransport({
//       host: "smtp.ethereal.email",
//       port: 587,
//       auth: {
//         user: "therese.ratke47@ethereal.email",
//         pass: "2G6F5hrZ2gZbFrxFVQ",
//       },
//     });

//     let info = await transporter.sendMail({
//       from: '"Sheshya" <therese.ratke47@ethereal.email>',
//       to: email,
//       subject: "Verify your Account",
//       text: `Your OTP is ${otp}`,
//     });

//     return res
//       .status(201)
//       .send(new ApiResponse(201, info, "Mail sent successfully"));
//   } catch (err) {
//     throw new ApiError(500, `Failed to send mail ${err}`);
//   }
// };

// module.exports = { sendOtpThroughMail };
