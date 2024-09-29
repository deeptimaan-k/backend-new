const { ApiError } = require("../utils/ApiError.js");


const verifyAdminRole = async (req, res, next) => {
  try {
    if (req.user.role !== "Admin") {
      throw new ApiError(403, "Forbidden: Admin access required");
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = verifyAdminRole;