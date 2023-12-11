const asyncHandler = require("express-async-handler");
const DirectMessages = require("../models/directMessagesModal");

const getDirectMessages = asyncHandler(async (req, res) => {
  const directMessages = await DirectMessages.find();
  res.status(200).json(directMessages);
});

module.exports = {
  getDirectMessages,
};
