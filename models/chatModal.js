const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  isGroupChat: { type: Boolean, default: false },
  chatName: {
    type: String,
    trim: true,
  },
  members: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
  ],
  groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
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

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
