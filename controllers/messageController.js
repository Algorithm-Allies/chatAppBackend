const asyncHandler = require("express-async-handler");

const Chat = require("../models/channelsModal.js");
const Message = require("../models/messageModel.js");

// @desc Get Chats the user is part of
// @route GET /api/messages
// @access Private
const getChats = asyncHandler(async (req, res) => {
  try {
    console.log("searching");
    console.log(req.user._id.toString());

    const result = await Chat.find({
      "members.user": req.user._id,
    }).populate("members.user", "-password"); // Populate the user field within the members array

    res.send(result);
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// @desc Create createGroupChat
// @route POST /api/messages/group
// @access Private
const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please fill in all the fields" });
  }

  const users = JSON.parse(req.body.users);

  users.push(req.user._id); // Assuming req.user is the user object, use req.user._id to get the user ID

  try {
    const groupChat = await Chat.create({
      channelName: req.body.name,
      createdBy: req.user._id, // Assuming req.user is the user object, use req.user._id to get the user ID
      members: users.map((user) => ({ user })), // Map user IDs to the expected structure
      groupAdmin: req.user._id, // Assuming req.user is the user object, use req.user._id to get the user ID
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("members.user", "-password") // Populate the user field within the members array
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Failed to create group chat", error });
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  try {
    const { channelId, channelName } = req.body;

    console.log("Updating group with ID:", channelId);

    const updatedChat = await Chat.findByIdAndUpdate(
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

    if (!updatedChat) {
      console.log("Chat not found");
      res.status(404).json({ error: "Chat Not Found" });
    } else {
      console.log("Chat updated successfully:", updatedChat);
      res.json(updatedChat);
    }
  } catch (error) {
    console.error("Error updating group:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { channelId, userId } = req.body;

  const added = await Chat.findByIdAndUpdate(
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
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
});


const removeFromGroup = asyncHandler(async (req, res) => {
  const { channelId, userId } = req.body;

  const removed = await Chat.findByIdAndUpdate(
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
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
});

module.exports = {
  getChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
