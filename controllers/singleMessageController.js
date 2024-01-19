const asyncHandler = require("express-async-handler");
const User = require("../models/userModel.js");
const Chat = require("../models/chatModal.js");
const Message = require("../models/messageModel.js");

const addSingleMessage = asyncHandler(async (req, res) => {
  try {
    const { chatId, text } = req.body;
    const userId = req.user._id;
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const isMember = chat.members.some((member) => member.user.equals(userId));
    if (!isMember) {
      return res
        .status(403)
        .json({ message: "User is not a member of this channel" });
    }

    const newMessage = await Message.create({ user: userId, text });

    const user = await User.findById(userId);

    const responseMessage = {
      _id: newMessage._id,
      text: newMessage.text,
      createdAt: newMessage.createdAt,
      updatedAt: newMessage.updatedAt,
      __v: newMessage.__v,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePhoto: user.profilePhoto,
      },
    };

    chat.messages.push(responseMessage);
    await chat.save();

    res.status(201).json({ message: "Message added to chat", responseMessage });
  } catch (error) {
    res.status(500).json({ message: "Error adding message to chat", error });
  }
});

const editSingleMessage = asyncHandler(async (req, res) => {
  try {
    const { messageId } = req.params;
    const { newText } = req.body;

    const message = await Message.findByIdAndUpdate(
      messageId,
      { text: newText },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.status(200).json({ message: "Message updated successfully", message });
  } catch (error) {
    res.status(500).json({ message: "Error updating message", error });
  }
});

const deleteSingleMessage = asyncHandler(async (req, res) => {
  try {
    const { messageId } = req.params;

    const deletedMessage = await Message.findByIdAndDelete(messageId);

    if (!deletedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }
    const chat = await Chat.updateMany(
      { messages: messageId },
      { $pull: { messages: messageId } }
    );

    res.status(200).json({
      message: "Message deleted successfully",
      deletedMessageId: deletedMessage._id,
      affectedChats: chat.nModified,
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting message", error });
  }
});

const viewSingleMessage = asyncHandler(async (req, res) => {
  const messageId = req.params.messageId;
  try {
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.status(200).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching message", error });
  }
});

const viewAllMessagesInChat = asyncHandler(async (req, res) => {
  const chatId = req.params.chatId;
  try {
    const chat = await Chat.findById(chatId)
      .populate({
        path: "messages",
        populate: {
          path: "user",
          select: "firstName lastName profilePhoto",
        },
      })
      .populate("members.user", "-password")
      .populate("groupAdmin", "-password");

    if (!chat) {
      throw new Error("Chat not found");
    }

    // Extract the populated messages from the chat and send them in the response
    const messages = chat.messages.map((message) => ({
      _id: message._id,
      text: message.text,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
      __v: message.__v,
      user: message.user, // Already populated by Mongoose
    }));

    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = {
  addSingleMessage,
  editSingleMessage,
  deleteSingleMessage,
  viewSingleMessage,
  viewAllMessagesInChat,
};
