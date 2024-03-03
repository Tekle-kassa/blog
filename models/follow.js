const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const followingSchema = new Schema({
  follower: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  followed: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Following = mongoose.model("Following", followingSchema);
module.exports = Following;
