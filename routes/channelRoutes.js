const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  getChannels, // Updated function name
  createChannel, // Updated function name
  renameChannel, // Updated function name
  addToChannel, // Updated function name
  removeFromChannel,
  getChannelById,
  deleteChat, // Updated function name
} = require("../controllers/channelController");
const { del } = require("express/lib/application");

router.route("/").get(protect, getChannels); // Updated function name

router.route("/getChannelById/:channelId").get(protect, getChannelById); // Updated function name

router.route("/createChannel").post(protect, createChannel); // Updated route and function name

router.route("/rename").put(protect, renameChannel); // Updated function name

router.route("/addUser").put(protect, addToChannel); // Updated route and function name

router.route("/removeUser").put(protect, removeFromChannel); // Updated route and function name

router.route("/:chatId").delete(protect, deleteChat); // Updated route and function name

module.exports = router;
