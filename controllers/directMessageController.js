const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Chat = require("../models/chatModal.js");
const User = require("../models/userModel.js");
const Message = require("../models/messageModel.js");

const createDirectMessage = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  try {
    const targetUserObjectId = new mongoose.Types.ObjectId(userId);
    const targetUser = await User.findById(targetUserObjectId);
    if (!targetUser) {
      return res.status(404).json({ message: "Targeted user not found" });
    }

    const isChat = await Chat.findOne({
      isGroupChat: false,
      members: {
        $all: [{ user: req.user._id }, { user: targetUserObjectId }],
        $size: 2, // Ensures both users are the only members
      },
    });

    console.log(isChat);
    if (isChat) {
      res.send(isChat);
    } else {
      const chatData = {
        chatName: targetUser.username, // Modify as needed
        isGroupChat: false,
        members: [{ user: req.user._id }, { user: targetUserObjectId }],
      };

      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id })
        .populate("members.user", "-password")
        .populate("messages"); // Assuming 'messages' is the field for storing messages

      res.status(200).json(fullChat);
    }
  } catch (error) {
    res.status(400).json({
      message: "Failed to create or retrieve chat",
      error: error.message,
    });
  }
});

const getAllDirectMessages = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user ID is available in the request

    // Find all direct chats where the user is a member
    const directChats = await Chat.find({
      isGroupChat: false,
      members: { $elemMatch: { user: userId } },
    })
      .populate("members.user", "-password")
      .populate("messages"); // Assuming 'messages' is the field for storing messages

    res.status(200).json(directChats);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Failed to fetch direct messages",
        error: error.message,
      });
  }
});

module.exports = {
  createDirectMessage,
  getAllDirectMessages,
};
