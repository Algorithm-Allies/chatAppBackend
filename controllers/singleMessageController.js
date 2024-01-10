const asyncHandler = require("express-async-handler");

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

    chat.messages.push(newMessage);
    await chat.save();

    res.status(201).json({ message: "Message added to chat", newMessage });
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
      .populate("members.user", "-password")
      .populate("groupAdmin", "-password")
      .populate("messages");

    if (!chat) {
      throw new Error("Chat not found");
    }

    res.json(chat.messages);
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
