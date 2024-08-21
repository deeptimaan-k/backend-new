const Admin = require("../models/adminSchema.js");
const jwt = require("jsonwebtoken");
const { ApiError } = require("../utils/ApiError.js");
const { ApiResponse } = require("../utils/ApiResponse.js");

const verifyJWT = async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }
  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log(decodedToken);
    const user = await Admin.findById(decodedToken?._id).select(
      "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
    );
    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }
    req.user = user;
    next();
  } catch (err) {
    console.log("Invalid token", err.message);
    return res
      .status(500)
      .json(
        new ApiResponse(
          err.statuscode || 500,
          null,
          err.message || "Invalid token"
        )
      );
  }
};

module.exports = verifyJWT;
