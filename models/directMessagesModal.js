const mongoose = require("mongoose");

const directMessageSchema = new mongoose.Schema({
  // direct_user: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User",
  //   required: true,
  // },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const DirectMessage = mongoose.model("DirectMessage", directMessageSchema);

module.exports = DirectMessage;
