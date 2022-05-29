const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
  {
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
    createAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false, // hide Mongoose 檔案的內部修訂號。
    toJSON: { virtuals: true }, // 使用到 virtual
    toObject: { virtuals: true },
  }
);

postSchema.virtual("comments", {
  ref: "comment",
  foreignField: "postId",
  localField: "_id",
});

const Post = mongoose.model("post", postSchema);

module.exports = Post;
