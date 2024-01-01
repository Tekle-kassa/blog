const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authUser");
const {
  registerUser,
  loginUser,
  logoutUser,
  createPost,
  likePost,
  followUser,
  addComment,
  likeComment,
  getMyPosts,
  posts,
  getPost,
} = require("../controllers/user");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/posts", protect, posts);
router.post("/post", protect, createPost);
router.get("/post/:postId", getPost);
router.get("/likePost/:postId", protect, likePost);
router.get("/myPosts", protect, getMyPosts);
router.get("/follow/:followedId", protect, followUser);
router.post("/comment/:postId", protect, addComment);
router.get("/likeComment/:commentId", protect, likeComment);

module.exports = router;
