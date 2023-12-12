const asyncHandler = require("express-async-handler");
const Channel = require("../models/channelsModal");

// @desc Get Channels
// @route GET /api/channels
const getChannels = asyncHandler(async (req, res) => {
  const channels = await Channel.find();
  res.status(200).json(channels);
});

// @desc Get Channels By Id
// @route GET /api/channels/:id

const getChannelById = asyncHandler(async (req, res) => {
  const channelId = req.params.id;

  try {
    const channel = await Channel.findById(channelId).populate(
      "members.user",
      "username"
    );

    if (!channel) {
      return res
        .status(404)
        .json({ success: false, message: "Channel not found" });
    }

    res.status(200).json(channel);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// @desc Create Channel
// @route POST /api/channels
const createChannel = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const { channelName } = req.body;

  try {
    const newChannel = await Channel.create({
      channelName,
      createdBy: userId,
      members: [{ user: userId, isAdmin: true }],
      messages: [],
    });

    res.status(201).json(newChannel);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Channel creation failed", error: error.message });
  }
});

// @desc Delete Channels By Id
// @route DELETE /api/channels/:id
const deleteChannel = asyncHandler(async (req, res) => {
  const channelId = req.params.id;

  try {
    const channel = await Channel.findByIdAndDelete(channelId);

    if (!channel) {
      return res
        .status(404)
        .json({ success: false, message: "Channel not found" });
    }

    res.status(200).json(channel);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});
module.exports = {
  getChannels,
  getChannelById,
  createChannel,
  deleteChannel,
};
