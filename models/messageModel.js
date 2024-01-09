const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    text: {
      type: String,
      required: [true, "Please add a message"],
    },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", messageSchema);
