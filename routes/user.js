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
  searchPost,
  updatePost,
  unfollowUser,
  myFollowers,
  myFollowings,
} = require("../controllers/user");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/posts", protect, posts);
router.post("/post", protect, createPost);
router.put("/post/:postId", protect, updatePost);
router.get("/post/:postId", getPost);
router.get("/likePost/:postId", protect, likePost);
router.get("/myPosts", protect, getMyPosts);
router.get("/post", protect, searchPost);
router.get("/myFollowers", protect, myFollowers);
router.get("/myFollowings", protect, myFollowings);
router.post("/follow/:followedId", protect, followUser);
router.post("/unfollow/:followedId", protect, unfollowUser);
router.post("/comment/:postId", protect, addComment);
router.get("/likeComment/:commentId", protect, likeComment);
// add a feature to see recommended users to follow

module.exports = router;
