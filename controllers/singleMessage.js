const asyncHandler = require("express-async-handler");

const Channel = require("../models/channelsModal.js");
const Message = require("../models/messageModel.js");

const addSingleMessage = asyncHandler(async (req, res) => {
  try {
    const { userId, channelId, text } = req.body;

    // Check if the channel exists
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    // Check if the user is a member of the channel
    const isMember = channel.members.some(
      (member) => member.user.toString() === userId
    );
    if (!isMember) {
      return res
        .status(403)
        .json({ message: "User is not a member of this channel" });
    }

    // Create the message
    const newMessage = await Message.create({ user: userId, text });

    // Add the message to the channel
    channel.messages.push(newMessage);
    await channel.save();

    res.status(201).json({ message: "Message added to channel", newMessage });
  } catch (error) {
    res.status(500).json({ message: "Error adding message to channel", error });
  }
});

const editSingleMessage = asyncHandler(async (req, res) => {
  //get message id
  //using message id update the message
  try {
    const { messageId } = req.params;
    const { newText } = req.body;

    // Find the message by ID and update its text
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
  //get message id
  //delete messagae using message id
  try {
    const { messageId } = req.params;

    // Find the message by ID and delete it
    const deletedMessage = await Message.findByIdAndDelete(messageId);

    if (!deletedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.status(200).json({
      message: "Message deleted successfully",
      deletedMessageId: deletedMessage._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting message", error });
  }
});

const viewSingleMessage = asyncHandler(async (req, res) => {
  const messageId = req.params.messageId; // Extract the message ID from the request parameters

  try {
    const message = await Message.findById(messageId); // Find the message by its ID

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.status(200).json(message); // Send the message content if found
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching message", error });
  }
});

module.exports = {
  addSingleMessage,
  editSingleMessage,
  deleteSingleMessage,
  viewSingleMessage,
};
