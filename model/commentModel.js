const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, "comment 不可為空"],
    },
    createAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "user", // id要去找user的那張表的ID
      required: [true, "comment 的user ID需要填寫"],
    },
    postId: {
      type: mongoose.Schema.ObjectId,
      ref: "post", // id要去找post的那張表的ID
      required: [true, "comment 的post ID需要填寫"],
    },
  },
  { versionKey: false }
);

// 若有find 則同時觸發此功能
commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "userId",
    select: "userName userId createAt",
  });

  next();
});

const Comment = mongoose.model("comment", commentSchema);
module.exports = Comment;
