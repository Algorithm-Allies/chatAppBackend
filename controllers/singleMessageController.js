const asyncHandler = require("express-async-handler");

const Channel = require("../models/channelsModal.js");
const Message = require("../models/messageModel.js");

const addSingleMessage = asyncHandler(async (req, res) => {
  try {
    const { userId, channelId, text } = req.body;

    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    const isMember = channel.members.some(
      (member) => member.user.toString() === userId
    );
    if (!isMember) {
      return res
        .status(403)
        .json({ message: "User is not a member of this channel" });
    }

    const newMessage = await Message.create({ user: userId, text });

    channel.messages.push(newMessage);
    await channel.save();

    res.status(201).json({ message: "Message added to channel", newMessage });
  } catch (error) {
    res.status(500).json({ message: "Error adding message to channel", error });
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
    const channels = await Channel.updateMany(
      { messages: messageId },
      { $pull: { messages: messageId } }
    );

    res.status(200).json({
      message: "Message deleted successfully",
      deletedMessageId: deletedMessage._id,
      affectedChannels: channels.nModified,
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

const viewAllMessagesInChannel = asyncHandler(async (req, res) => {
  const channelId = req.params.channelId;
  try {
    const channel = await Channel.findById(channelId)
      .populate("members.user", "-password")
      .populate("groupAdmin", "-password")
      .populate("messages");

    if (!channel) {
      throw new Error("Channel not found");
    }
    //const messages = await Message.find({ _id: { $in: channel.messages } });

    res.json(channel.messages);
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
  viewAllMessagesInChannel,
};
