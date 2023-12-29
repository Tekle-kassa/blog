const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: {
    type: String,
  },
  text: {
    type: String,
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
