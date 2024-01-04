const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  getChannels, // Updated function name
  getChannelById,
  createChannel, // Updated function name
  renameChannel, // Updated function name
  addMemberToChannel, // Updated function name
  removeMemberFromChannel, // Updated function name
  getChannelMessages,
  addMessageToChannel,
  editChannelMessage,
  deleteChannelMessage,
} = require("../controllers/channelController");

router.route("/").get(protect, getChannels); // Updated function name

router.route("/").post(protect, createChannel); // Updated route and function name

router.route("/:id").get(getChannelById);

router.route("/:id/rename").put(protect, renameChannel); // Updated function name

router.route("/:id/addUser").put(protect, addMemberToChannel); // Updated route and function name

router.route("/:id/removeUser").put(protect, removeMemberFromChannel); // Updated route and function name

router.route("/:id/messages").get(getChannelMessages);

router.route("/:id/addMessage").post(protect, addMessageToChannel);

router.route("/:id/addMessage").post(protect, addMessageToChannel);

router.route("/:id/editMessage").put(protect, editChannelMessage);

router.route("/:id/deleteMessage").put(protect, deleteChannelMessage);

//router.route("/:id").put(updateMessage).delete(deleteMessage);

module.exports = router;
