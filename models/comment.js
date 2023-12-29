const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: "Post",
  },
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

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
