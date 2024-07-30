

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    let fileExtension = path.extname(file.originalname);
    const filenameWithoutExtension = path
      .basename(file.originalname, fileExtension)
      .toLowerCase()
      .split(" ")
      .join("-");
    cb(
      null,
      filenameWithoutExtension +
        "-" +
        Date.now() +
        "-" +
        Math.ceil(Math.random() * 1e5) +
        fileExtension
    );
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

module.exports = { upload };
