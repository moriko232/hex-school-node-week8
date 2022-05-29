const { reject } = require("bcrypt/promises");
var jwt = require("jsonwebtoken");
const appError = require("../service/appError");
const handleErrAsync = require("../service/handleErrAsync");
const User = require("../model/userModel.js");
// 檢查登入權限
async function isAuth(req, res, next) {
  // 從headers的authorization抓取token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // 抓取Bearer後面那一段
    token = req.headers.authorization.split(" ")[1];
  }
  // console.log("token", token);

  if (!token) {
    return appError({ httpStatus: 401, errMessage: "尚未登入" }, next);
  }

  const decodeJWT = await new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload);
      }
    });
  });
  // console.log("decodeJWT", decodeJWT);

  const currentUser = await User.findOne({ _id: decodeJWT.id });
  // console.log("currentUser", currentUser);

  // 將通過的user寫到req再傳回
  req.user = currentUser;

  next();
}

module.exports = handleErrAsync(isAuth);
