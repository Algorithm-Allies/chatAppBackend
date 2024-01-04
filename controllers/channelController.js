const asyncHandler = require("express-async-handler");

const Channel = require("../models/channelModel.js");
const Message = require("../models/messageModel.js");

// @desc Get Channels the user is part of
// @route GET /api/channels/
// @access Private
const getChannels = asyncHandler(async (req, res) => {
  try {
    console.log("searching");
    console.log(req.user._id.toString());

    const result = await Channel.find({
      "members.user": req.user._id,
    }).populate("members.user", "-password"); // Populate the user field within the members array

    res.send(result);
  } catch (error) {
    console.error("Error fetching channels:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// @desc Get Channel by ID
// @route GET /api/channels/:id
// @access Private
const getChannelById = asyncHandler(async (req, res) => {
  const channelId = req.params.id;
  try {
    const channel = await Channel.findById(channelId)
      .populate("members.user", "-password")
      .populate("groupAdmin", "-password")
      .populate("messages");

    if (!channel) {
      res.status(404);
      throw new Error("Channel Not Found");
    } else {
      res.json(channel);
    }
  } catch (error) {
    console.error("Error fetching channel:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// @desc Create channel
// @route POST /api/channels/
// @access Private
const createChannel = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please fill in all the fields" });
  }

  const users = JSON.parse(req.body.users);

  users.push(req.user._id);

  try {
    const groupChannel = await Channel.create({
      channelName: req.body.name,
      createdBy: req.user._id,
      members: users.map((user) => ({ user })),
      groupAdmin: req.user._id,
    });

    const fullGroupChannel = await Channel.findOne({ _id: groupChannel._id })
      .populate("members.user", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChannel);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Failed to create group channel", error });
  }
});

// @desc Rename channel
// @route PUT /api/channels/:id/rename
// @access Private
const renameChannel = asyncHandler(async (req, res) => {
  try {
    const { channelId, channelName } = req.body;

    console.log("Updating channel with ID:", channelId);

    const updatedChannel = await Channel.findByIdAndUpdate(
      channelId,
      {
        channelName: channelName,
      },
      {
        new: true,
      }
    )
      .populate("members.user", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChannel) {
      console.log("Channel not found");
      res.status(404).json({ error: "Channel Not Found" });
    } else {
      console.log("Channel updated successfully:", updatedChannel);
      res.json(updatedChannel);
    }
  } catch (error) {
    console.error("Error updating channel:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// @desc Add member to channel
// @route PUT /api/channels/:id/addUser
// @access Private
const addMemberToChannel = asyncHandler(async (req, res) => {
  const { channelId, userId } = req.body;

  const added = await Channel.findByIdAndUpdate(
    channelId,
    {
      $push: { members: { user: userId } },
    },
    { new: true }
  )
    .populate("members.user", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404);
    throw new Error("Channel Not Found");
  } else {
    res.json(added);
  }
});

// @desc Remove member from channel
// @route PUT /api/channels/:id/removeUser
// @access Private
const removeMemberFromChannel = asyncHandler(async (req, res) => {
  const { channelId, userId } = req.body;

  const removed = await Channel.findByIdAndUpdate(
    channelId,
    {
      $pull: { members: { user: userId } },
    },
    { new: true }
  )
    .populate("members.user", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Channel Not Found");
  } else {
    res.json(removed);
  }
});

// @desc Add message to channel
// @route POST /api/channels/:id/addMessage
// @access Private
const addMessageToChannel = asyncHandler(async (req, res) => {
  
  const { channelId, text } = req.body;


  const newMessage = await Message.create({
    user: req.user._id,
    text: text,
    channel: channelId,
  });

  const updatedChannel = await Channel.findByIdAndUpdate(
    channelId,
    {
      $push: { messages: newMessage._id },
    },
    { new: true }
  )
    .populate("members.user", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChannel) {
    res.status(404);
    throw new Error("Channel Not Found");
  } else {
    res.json(updatedChannel);
  }
});

// @desc Edit message in channel
// @route PUT /api/channels/:id/editMessage
// @access Private
const editChannelMessage = asyncHandler(async (req, res) => {
  const { channelId, messageId, updatedContent } = req.body;

  try {
    const updatedMessage = await Message.findByIdAndUpdate(
      { _id: messageId, channel: channelId },
      { content: updatedContent },
      { new: true }
    );

    if (!updatedMessage) {
      res.status(404).json({ error: "Message Not Found" });
    } else {
      res.json(updatedMessage);
    }
  } catch (error) {
    console.error("Error updating message:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const deleteChannelMessage = asyncHandler(async (req, res) => {
  const { channelId, messageId } = req.body;

  try {
    // Delete the messagefrom specified channel
    const deletedMessage = await Message.findByIdAndDelete({
      _id: messageId,
      channel: channelId,
    });

    if (!deletedMessage) {
      res.status(404).json({ error: "Message not found" });
    } else {
      // Remove the deleted message from the channel's message array
      const updatedChannel = await Channel.findByIdAndUpdate(
        channelId,
        { $pull: { messages: messageId } },
        { new: true }
      ).populate("messages");

      if (!updatedChannel) {
        res.status(404).json({ error: "Channel not found" });
      } else {
        res.json({
          message: "Message deleted successfully",
          channel: updatedChannel,
        });
      }
    }
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = {
  getChannels,
  getChannelById,
  createChannel,
  renameChannel,
  addMemberToChannel,
  removeMemberFromChannel,
  addMessageToChannel,
  editChannelMessage,
  deleteChannelMessage,
};
