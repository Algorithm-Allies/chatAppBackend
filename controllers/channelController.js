const asyncHandler = require("express-async-handler");
const Channel = require("../models/channelsModal");

const getChannels = asyncHandler(async (req, res) => {
  const channels = await Channel.find();
  res.status(200).json(channels);
});

module.exports = {
  getChannels,
};
