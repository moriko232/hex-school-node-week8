const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
  {
    // userId: {
    //   type: String,
    //   required: [true, "ID必填"],
    // },
    userData: {
      type: mongoose.Schema.ObjectId,
      ref: "user", // id要去找user的那張表的ID
      required: [true, "ID需要填寫"],
    },
    title: {
      type: String,
      required: [true, "標題必填"],
    },
    content: {
      type: String,
      required: [true, "內容必填"],
    },
    imgUrl: {
      type: String,
      required: false,
    },
    tag: {
      type: String,
      required: [true, "標籤必填"],
    },
    likes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "user", // id要去找user的那張表的ID
      },
    ],
    comments: {
      type: Number,
      default: 0,
    },
    createAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false } //  Mongoose 檔案的內部修訂號。
);
const Post = mongoose.model("post", postSchema);

module.exports = Post;
