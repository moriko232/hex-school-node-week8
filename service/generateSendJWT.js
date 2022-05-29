var jwt = require("jsonwebtoken");
// 發JWT token (登入用)
// 新token = jwt.sign( {id: user在mongoDB的ID} ,  SECRET ,  { 其他資料 }  )
function generateSendJWT(user, statusCode, res) {
  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_DAY,
    }
  );
  console.log("token", token);

  // clear password
  user.password = "";

  // res token
  res.status(statusCode).json({
    status: "success",
    user: {
      name: user.userName,
      token,
    },
  });

  res.end();
}

module.exports = generateSendJWT;
