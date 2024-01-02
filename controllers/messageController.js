const asyncHandler = require("express-async-handler");

const Channel = require("../models/channelsModal.js");
const Message = require("../models/messageModel.js");

// @desc Get Channels the user is part of
// @route GET /api/messages
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

// @desc Create createChannel
// @route POST /api/messages/channel
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

const addToChannel = asyncHandler(async (req, res) => {
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

const removeFromChannel = asyncHandler(async (req, res) => {
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

module.exports = {
  getChannels,
  createChannel,
  renameChannel,
  addToChannel,
  removeFromChannel,
};
