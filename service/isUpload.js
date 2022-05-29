// const handleErrAsync = require("./handleErrAsync");
// const appError = require("../service/appError");
const path = require("path");
const multer = require("multer");

const isUpload = multer({
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
  fileFilter(req, file, cb, next) {
    const ext = path.extname(file.originalname).toLowerCase();
    console.log("ext-----------", ext);
    if (ext !== ".jpg" && ext !== ".png" && ext !== ".jpeg") {
      cb(new Error("檔案格式錯誤，僅限上傳 jpg、jpeg 與 png 格式。")); // 不接受檔案
    }
    cb(null, true); // 接受檔案
  },
}).any();

module.exports = isUpload;
