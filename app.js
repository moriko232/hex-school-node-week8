var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var { resError_Prod, resError_Dev } = require("./service/envErrorLog");

require("./connect/db.js");
var indexRouter = require("./routes/index");
var postsRouter = require("./routes/posts");
var usersRouter = require("./routes/users");
var uploadRouter = require("./routes/upload");

var app = express();

// 發生重大錯誤會到這
process.on("uncaughtException", (err) => {
  console.error("Uncaughted Exception: ");
  console.error(err);
  // 記錄錯誤下來，等到所有其他服務處理完成，然後停掉該process
  // server.close(() => {
  process.exit(1);
  // });
});

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/", postsRouter);
app.use("/", usersRouter);
app.use("/", uploadRouter);

// error 404 找不到路由會到這
app.use((req, res) => {
  console.error("404 err");
  res.status(404).json({
    status: "error",
    message: "無此路由資訊",
  });
});

// error 500 預期next(err)的錯誤會到這
app.use(function (err, req, res, next) {
  err.statusCode = err.statusCode || 500;

  // dev
  if (process.env.NODE_ENV === "dev") {
    return resError_Dev(err, res);
  }
  // production
  if (err.name === "ValidationError") {
    err.message = "資料欄位未填寫正確，請重新輸入！";
    err.isOperational = true;
    return resError_Prod(err, res);
  }
  resError_Prod(err, res);
});

// app.use((err, req, res, next) => {
//   console.error("500 err: ", err);
//   // errorHandler(res, err.message, 500);
// });

// 其他未預期的錯誤會到這
process.on("unhandleRejection", (err, promise) => {
  console.error("未捕捉的錯誤: ", promise, "。原因: ", err);
});

module.exports = app;
