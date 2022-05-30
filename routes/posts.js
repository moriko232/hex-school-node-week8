var express = require("express");
var router = express.Router();
const Post = require("../model/postModel.js");
const Comment = require("../model/commentModel.js");

const isAuth = require("../service/isAuth.js");
const appError = require("../service/appError");
const handleErrAsync = require("../service/handleErrAsync");
const successHandler = require("../service/successHandler");

router.get(
  "/posts",
  isAuth,
  handleErrAsync(async (req, res) => {
    const timeSort = req.query.timeSort == "asc" ? "createAt" : "-createAt";
    const q =
      req.query.q !== undefined ? { content: new RegExp(req.query.q) } : {};

    const allData = await Post.find(q)
      .populate({
        path: "userData",
        select: "userName avatarUrl",
      })
      .populate({
        path: "comments",
        select: "comment user",
      })
      .sort(timeSort);
    successHandler(res, allData);
  })
);

// 新增POSTS
router.post(
  "/post",
  isAuth,
  handleErrAsync(async (req, res, next) => {
    const data = req.body;
    const UserId = req.user.id;

    if (data.title === undefined) {
      appError({ errMessage: "POST title未填寫" }, next);
      return;
    }

    const post = {
      userData: UserId,
      title: data.title,
      content: data.content,
      imgUrl: data.imgUrl,
      tag: data.tag,
    };
    await Post.create(post).then(async () => {
      const allData = await Post.find();
      successHandler(res, allData);
    });
  })
);

// 刪除所有POSTS
router.delete(
  "/posts",
  isAuth,
  handleErrAsync(async (req, res, next) => {
    await Post.deleteMany({}).then(async () => {
      const allData = await Post.find();
      successHandler(res, allData);
    });
  })
);

// 刪除單筆POST
router.delete(
  "/post/:id",
  isAuth,
  handleErrAsync(async (req, res, next) => {
    const id = req.params.id;
    const findPostId = await Post.findById(id);
    if (findPostId === null) {
      appError({ errMessage: "文章不存在" }, next);
      return;
    }
    await Post.findByIdAndDelete(ss).then(async () => {
      const allData = await Post.find();
      successHandler(res, allData);
    });
  })
);

// 取得單筆POST
router.get(
  "/post/:id",
  isAuth,
  handleErrAsync(async (req, res, next) => {
    const id = req.params.id;
    const findPost = await Post.findById(id)
      .populate({
        path: "userData",
        select: "userName avatarUrl",
      })
      .populate({
        path: "comments",
        select: "comment user",
      });
    if (findPost === null) {
      appError({ errMessage: "文章不存在" }, next);
      return;
    }
    successHandler(res, findPost);
  })
);

// 修改單筆POST
router.patch(
  "/post/:id",
  isAuth,
  handleErrAsync(async (req, res, next) => {
    const data = req.body;
    const id = req.params.id;

    const findPostId = await Post.findById(id);
    if (findPostId === null) {
      appError({ errMessage: "文章不存在" }, next);
      return;
    }
    if (data.title === undefined) {
      appError({ errMessage: "格式錯誤或無該筆資料" }, next);
      return;
    }

    const post = {
      tag: data.tag,
      userName: data.userName,
      title: data.title,
      content: data.content,
      imgUrl: data.imgUrl,
    };
    await Post.findByIdAndUpdate(id, post).then(async () => {
      const allData = await Post.find();
      successHandler(res, allData);
    });
  })
);

// 按讚
router.post(
  "/post/:id/likes",
  isAuth,
  handleErrAsync(async (req, res, next) => {
    const postId = req.params.id;
    const UserId = req.user.id;

    const findPostId = await Post.findById(postId);
    if (findPostId === null) {
      appError({ errMessage: "按讚的文章不存在" }, next);
      return;
    }
    // console.log("req.user.", req.user);

    const post = {
      $addToSet: { likes: UserId },
    };
    await Post.findOneAndUpdate({ _id: postId }, post).then(async () => {
      const allData = await Post.find();
      successHandler(res, allData);
    });
  })
);

// 取消讚
router.delete(
  "/post/:id/likes",
  isAuth,
  handleErrAsync(async (req, res, next) => {
    const postId = req.params.id;
    const UserId = req.user.id;

    const findPostId = await Post.findById(postId);
    if (findPostId === null) {
      appError({ errMessage: "取消讚的文章不存在" }, next);
      return;
    }
    // console.log("req.user.", req.user);

    const post = {
      $pull: { likes: UserId },
    };
    await Post.findOneAndUpdate({ _id: postId }, post).then(async () => {
      const allData = await Post.find();
      successHandler(res, allData);
    });
  })
);

// 取得會員文章
router.get(
  "/post/user/:id",
  handleErrAsync(async (req, res, next) => {
    const userId = req.params.id;
    const posts = await Post.find({ userData: userId });
    successHandler(res, { posts });
  })
);

// 取得會員自己的按讚列表
router.get(
  "/likelist",
  isAuth,
  handleErrAsync(async (req, res, next) => {
    console.log("user id", req.user);
    const userId = req.user.id;
    const posts = await Post.find({ likes: { $in: [userId] } });
    console.log("posts----------", posts);
    successHandler(res, { posts });
  })
);

// 留言
router.post(
  "/post/:id/comment",
  isAuth,
  handleErrAsync(async (req, res, next) => {
    const postId = req.params.id;
    const userId = req.user.id;
    const { comment } = req.body;

    const findPostId = await Post.findById(postId);
    if (findPostId === null) {
      appError({ errMessage: "留言的文章不存在" }, next);
      return;
    }

    const newComm = await Comment.create({
      comment,
      postId,
      userId,
    });

    successHandler(res, newComm);
  })
);

module.exports = router;
