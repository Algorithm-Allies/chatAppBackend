const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  getChannels, // Updated function name
  createChannel, // Updated function name
  renameChannel, // Updated function name
  addToChannel, // Updated function name
  removeFromChannel, // Updated function name
} = require("../controllers/messageController");

router.route("/").get(protect, getChannels); // Updated function name

router.route("/channel").post(protect, createChannel); // Updated route and function name

router.route("/rename").put(protect, renameChannel); // Updated function name

router.route("/channelAddUser").put(protect, addToChannel); // Updated route and function name

router.route("/channelRemoveUser").put(protect, removeFromChannel); // Updated route and function name

//router.route("/:id").put(updateMessage).delete(deleteMessage);

module.exports = router;
