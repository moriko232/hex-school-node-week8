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
    followers: [
      {
        userData: { type: mongoose.Schema.ObjectId, ref: "User" },
        createAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    following: [
      {
        userData: { type: mongoose.Schema.ObjectId, ref: "User" },
        createAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    createAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
  },
  { versionKey: false }
);

// 若有find 則同時觸發此功能
userSchema.pre(/^find/, function (next) {
  this.populate({
    path: "following",
    populate: {
      path: "userData",
      model: "user",
      select: "userName userId",
    },
  });

  next();
});

const User = mongoose.model("user", userSchema);

module.exports = User;
