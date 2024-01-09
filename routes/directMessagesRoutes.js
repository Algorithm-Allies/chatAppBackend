const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  createDirectMessage,
  getAllDirectMessages,
  getDirectMessageById,
} = require("../controllers/directMessageController");

router.route("/").post(protect, createDirectMessage);
router.route("/").get(protect, getAllDirectMessages);
router.route("/:chatId").get(protect, getDirectMessageById);

module.exports = router;
