const asyncHandler = require("express-async-handler");

const Message = require("../models/messageModel");

// @desc Get messages
// @route GET /api/messages
// @access Private
const getMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find();
  res.status(200).json(messages);
});

// @desc Create message
// @route POST /api/messages
// @access Private
const createMessage = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400);
    throw new Error("Please add a text field");
  }

  const message = await Message.create({
    text: req.body.text,
  });
  res.status(200).json(message);
});

// @desc update message
// @route PUT /api/messages/:id
// @access Private
const updateMessage = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.id);

  if (!message) {
    res.status(404);
    throw new Error("Message not found");
  }

  const updatedMessage = await Message.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );

  res.status(200).json(updatedMessage);
});

// @desc Delete message
// @route DELETE /api/messages/:id
// @access Private
const deleteMessage = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.id);

  if (!message) {
    res.status(404);
    throw new Error("Message not found");
  }

  await message.deleteOne();

  res.status(200).json({ id: req.params.id });
});

module.exports = { getMessages, createMessage, updateMessage, deleteMessage };
