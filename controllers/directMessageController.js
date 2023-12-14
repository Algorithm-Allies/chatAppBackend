const asyncHandler = require("express-async-handler");
const DirectMessages = require("../models/directMessagesModal");
const User = require("../models/userModel");
// @desc Get Direct Messages
// @route GET /api/directMessages
const getDirectMessages = asyncHandler(async (req, res) => {
  const directMessages = await DirectMessages.find();
  res.status(200).json(directMessages);
});

// @desc Create new DirectMessage
// @route POST /api/directMessages/:id
const createDirectMessage = async (req, res) => {
  const { loggedInUserId, directUserId } = req.params;
  console.log(loggedInUserId, directUserId);
  if (!loggedInUserId || !directUserId) {
    return res.status(400).json({ message: "Invalid user data" });
  }

  try {
    const newDirectMessage = await DirectMessage.create({
      users: [loggedInUserId, directUserId],
      messages: [],
    });

    const loggedInUser = await User.findById(loggedInUserId);
    const directUser = await User.findById(directUserId);

    console.log(loggedInUser, directUser);

    loggedInUser.directMessages.push(newDirectMessage._id);
    directUser.directMessages.push(newDirectMessage._id);

    await loggedInUser.save();
    await directUser.save();

    res.status(201).json(newDirectMessage);
  } catch (error) {
    res.status(500).json({ message: "Error creating direct message", error });
  }
};

// @desc Delete DirectMessage
// @route DELETE /api/directMessages/:id
const deleteDirectMessage = asyncHandler(async (req, res) => {
  const directUserId = req.params.id;

  const directMessage = await DirectMessages.findOneAndDelete({
    direct_user: directUserId,
  });

  if (!directMessage) {
    res.status(404).json({ message: "Direct message not found" });
    return;
  }

  res.status(200).json({
    message: "Direct message deleted successfully",
    deletedConvo: directMessage,
  });
});

// @desc Get Direct Messages by Specific User
// @route GET /api/directMessages/:id
const getDirectMessagesByUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const directMessages = await DirectMessages.find({
      users: { $in: [id] },
    });

    res.status(200).json(directMessages);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch direct messages" });
  }
});

module.exports = {
  getDirectMessages,
  createDirectMessage,
  getDirectMessagesByUser,
  deleteDirectMessage,
};
