const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  friends: [{ type: mongoose.Types.ObjectId }],
  friendRequests: [{ type: mongoose.Types.ObjectId }]
});

const user = mongoose.model("User", userSchema);
module.exports = user;
