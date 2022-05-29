var express = require("express");
var router = express.Router();

const isAuth = require("../service/isAuth.js");
const isUpload = require("../service/isUpload.js");
const appError = require("../service/appError");
const handleErrAsync = require("../service/handleErrAsync");
const successHandler = require("../service/successHandler");

const { ImgurClient } = require("imgur");
const sizeOf = require("image-size");

// 上傳圖片
router.post(
  "/upload",
  isAuth,
  isUpload,
  handleErrAsync(async (req, res, next) => {
    if (!req.files) {
      appError({ errMessage: "未上傳任何檔案" }, next);
    }

    const dimensions = sizeOf(req.files[0].buffer);
    console.log(dimensions);
    if (dimensions.width !== dimensions.height) {
      return appError({ errMessage: "圖片長寬不符合 1:1 尺寸。" }, next);
    }

    const client = new ImgurClient({
      clientId: process.env.IMGUR_CLIENT_ID,
      clientSecret: process.env.IMGUR_CLIENT_SECRET,
      refreshToken: process.env.IMGUR_REFLESH_TOKEN,
    });

    const response = await client.upload({
      image: req.files[0].buffer.toString("base64"),
      type: "base64",
      album: process.env.IMGUR_ALBUM_ID,
    });
    // console.log("response img", response);

    successHandler(res, { imgUrl: response.data.link });
  })
);

module.exports = router;
