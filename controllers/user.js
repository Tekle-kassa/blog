const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const phoneNumberFormatter = require("../utils/phoneNumberFormatter");
const protect = require("../middlewares/authUser");
const isValidPhoneNumber = (phoneNumber) => {
  const phoneRegex =
    /(^\+\s*2\s*5\s*1\s*(9|7)\s*(([0-9]\s*){8}\s*)$)|(^0\s*(9|7)\s*(([0-9]\s*){8})$)/;
  return phoneRegex.test(phoneNumber);
};
module.exports.registerUser = async (req, res) => {
  try {
    const { username, phoneNumber, password } = req.body;
    const formatedPhoneNumber = phoneNumberFormatter(phoneNumber);
    if (!formatedPhoneNumber || !password || !username) {
      return res
        .status(400)
        .json({ message: "please fill all the required fields" });
    }
    const userExists = await User.findOne({ phoneNumber: formatedPhoneNumber });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "phone number has already been used" });
    }
    const user = new User({
      username,
      phoneNumber: formatedPhoneNumber,
      password,
    });
    await user.save();
    const token = generateToken(user._id);
    const generateToken = (id) => {
      return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    };
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400 * 30),
      sameSite: "none",
      secure: true,
    });
    res
      .status(201)
      .json({ _id: user._id, phoneNumber: user.phoneNumber, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports.loginUser = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;
    if (!phoneNumber || !password) {
      return res
        .status(400)
        .json({ message: "please provide phone number and password" });
    }
    if (!isValidPhoneNumber(phoneNumber)) {
      return res
        .status(400)
        .json({ message: "please provide a valid phone number" });
    }
    const formatedPhoneNumber = phoneNumberFormatter(phoneNumber);
    const user = await User.findOne({ phoneNumber: formatedPhoneNumber });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid phone number or password" });
    }
    const passwordIsCorrect = await bcrypt.compare(password, user.password);
    if (!passwordIsCorrect) {
      return res
        .status(400)
        .json({ message: "Invalid phone number or password" });
    }
    const token = generateToken(user._id);
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 86400 * 30),
      sameSite: "none",
      secure: true,
    });
    res.status(200).json({
      _id: user._id,
      phoneNumber: user.phoneNumber,
      token,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
module.exports.logoutUser = async (req, res, next) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  });
  return res.status(200).json({
    message: "successfully logged out",
  });
};
module.exports.createPost = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: "the post cant be empty" });
    }
    const post = new Post({ text });
    post.owner = req.user._id;
    await post.save();
    const user = await User.findById(req.user._id);
    user.posts.push(post._id);
    await user.save();
    res.status(201).json({ message: "post successful", post });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "internal server error", error: error.message });
  }
};
module.exports.likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }
    const user = await User.findById(req.user._id);
    post.likes.push(user._id);
    user.likes.push(post._id);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "internal server error", error: error.message });
  }
};
module.exports.followUser = async (req, res) => {
  try {
    const { followedId } = req.params;
    const followedUser = await User.findById(followedId);
    if (!followedUser) {
      return res.status(404).json({ message: "user not found" });
    }
    const user = await User.findById(req.user._id);
    user.follows.push(followedId);
    followedUser.followers.push(user._id);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "internal server error", error: error.message });
  }
};
module.exports.addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;
    if (!text) {
      return res.status(404).json({ message: "comment can not be empty" });
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }
    const user = await User.findById(req.user._id);
    const comment = new Comment({
      text,
      post: post._id,
      owner: user._id,
    });
    await comment.save();
    user.comments.push(comment._id);
    await user.save();
    const wholePost = post.populate("comments");
    res.status(201).json({ post: wholePost });
  } catch (error) {
    res
      .status(500)
      .json({ message: "internal server error", error: error.message });
  }
};
module.exports.likeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "comment not found" });
    }
    const user = await User.findById(req.user._id);
    comment.likes.push(user._id);
    user.likedComments.push(comment._id);
    await comment.save();
    await user.save();
  } catch (error) {
    res
      .status(500)
      .json({ message: "internal server error", error: error.message });
  }
};
