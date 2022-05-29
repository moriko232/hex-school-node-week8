const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "名字必填"],
    },
    email: {
      type: String,
      required: [true, "email必填"],
    },
    password: {
      type: String,
      required: [true, "password必填"],
      minlength: 8,
      select: false,
    },
    gender: {
      type: String,
      required: false,
      enum: ["male", "female"],
    },
    avatarUrl: {
      type: String,
      required: false,
    },
    createAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
  },
  { versionKey: false }
);
const User = mongoose.model("user", userSchema);

module.exports = User;
