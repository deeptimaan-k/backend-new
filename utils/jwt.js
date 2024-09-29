// const jwt = require("jsonwebtoken");
// const { ApiError } = require("./ApiError");

// const secretKey = process.env.JWT_SECRET || "yourSecretKey"; // Use a strong secret key in production

// const generateToken = (payload, expiresIn = "1h") => {
//   return jwt.sign(payload, secretKey, { expiresIn });
// };

// const verifyToken = (token) => {
//   try {
//     return jwt.verify(token, secretKey);
//   } catch (err) {
//     throw new ApiError(400, "Invalid token");
//   }
// };

// module.exports = {
//   generateToken,
//   verifyToken,
// };
