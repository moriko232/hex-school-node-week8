var express = require("express");
var validator = require("validator");
var bcrypt = require("bcrypt");
var router = express.Router();
const User = require("../model/userModel.js");

const generateSendJWT = require("../service/generateSendJWT.js");
const isAuth = require("../service/isAuth.js");
const appError = require("../service/appError");
const handleErrAsync = require("../service/handleErrAsync");
const successHandler = require("../service/successHandler");
var jwt = require("jsonwebtoken");
// 列出會員
router.get(
  "/users",
  handleErrAsync(async (req, res, next) => {
    const allUser = await User.find();
    successHandler(res, allUser);
  })
);

// 會員註冊
router.post(
  "/user/sign_up",
  handleErrAsync(async (req, res, next) => {
    const data = req.body;
    let { email, userName, password } = data;

    // 手動檢查欄位
    if (!userName) {
      return appError({ errMessage: "未填寫userName" }, next);
    }
    if (!email) {
      return appError({ errMessage: "未填寫email" }, next);
    }
    if (!password) {
      return appError({ errMessage: "未填寫password" }, next);
    }
    if (!validator.isEmail(email)) {
      return appError({ errMessage: "email格式有誤" }, next);
    }
    if (!validator.isLength(password, { min: 8 })) {
      return appError({ errMessage: "密碼未達8碼" }, next);
    }
    const existUser = await User.find({ email });
    if (existUser.length) {
      return appError({ errMessage: "此email已被使用" }, next);
    }

    // 加密password
    password = await bcrypt.hash(password, 12);
    console.log("new pw", password);

    const user = {
      userName,
      email,
      password,
    };
    console.log("new user", user);

    const newUser = await User.create(user);

    generateSendJWT(newUser, 201, res);
  })
);

// 會員登入
router.post(
  "/user/login",
  handleErrAsync(async (req, res, next) => {
    const data = req.body;
    let { email, password } = data;

    // 手動檢查欄位
    if (!email) {
      return appError({ errMessage: "未填寫email" }, next);
    }
    if (!password) {
      return appError({ errMessage: "未填寫password" }, next);
    }
    if (!validator.isEmail(email)) {
      return appError({ errMessage: "帳號或密碼有誤" }, next);
    }
    if (!validator.isLength(password, { min: 8 })) {
      return appError({ errMessage: "帳號或密碼有誤" }, next);
    }

    // +password可以額外撈出原本select false的資料
    const findUser = await User.findOne({ email }).select("+password");
    // console.log("finduser", findUser);
    if (!findUser) {
      return appError({ errMessage: "帳號或密碼有誤" }, next);
    }

    const isPass = await bcrypt.compare(password, findUser.password);
    if (!isPass) {
      return appError({ errMessage: "帳號或密碼有誤" }, next);
    }

    generateSendJWT(findUser, 201, res);
  })
);

// 取得會員資料
router.get(
  "/user/profile",
  isAuth,
  handleErrAsync(async (req, res, next) => {
    const id = req.user.id;
    console.log("id", id);
    const UserData = await User.findById(id);
    successHandler(res, UserData);
  })
);

// 更新會員資料
router.patch(
  "/user/profile",
  isAuth,
  handleErrAsync(async (req, res, next) => {
    const userId = req.user.id;
    const data = req.body;
    const userData = {
      userName: data.userName,
      gender: data.gender,
      avatarUrl: data.avatarUrl,
    };
    // console.log("userData", userData);

    const newUserData = await User.findByIdAndUpdate(userId, userData);
    // console.log("newUserData", newUserData);

    successHandler(res, newUserData);
  })
);

// 更改密碼
router.post(
  "/user/updatePassword",
  isAuth,
  handleErrAsync(async (req, res, next) => {
    const userId = req.user.id;
    const data = req.body;
    let { oldPassword, password } = data;
    // console.log("req.headers", req.headers.authorization);
    // console.log("req.headers", req.headers.authorization.startsWith("Bearer"));
    // +password可以額外撈出原本select false的資料
    const findUser = await User.findOne({ id: userId }).select("+password");
    const isPass = await bcrypt.compare(oldPassword, findUser.password);
    if (!isPass) {
      return appError({ errMessage: "舊密碼有誤，請重新輸入" }, next);
    }

    const hashPassword = await bcrypt.hash(password, 12);
    const newUserData = await User.findByIdAndUpdate(userId, {
      password: hashPassword,
    });

    successHandler(res, newUserData);
  })
);

module.exports = router;
