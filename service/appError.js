// 捕捉自定義可預期err
const appError = ({ httpStatus = 400, errMessage }, next) => {
  const error = new Error(errMessage);
  error.statusCode = httpStatus;
  error.isOperational = true;
  next(error);
};

module.exports = appError;
