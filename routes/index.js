var express = require("express");
var router = express.Router();

const handleErrAsync = require("../service/handleErrAsync");

/* GET users listing. */
router.get(
  "/",
  handleErrAsync((req, res, next) => {
    res.send("respond with a resource");
  })
);

module.exports = router;
