const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  addSingleMessage,
  editSingleMessage,
  deleteSingleMessage,
  viewSingleMessage,
  viewAllMessagesInChat,
} = require("../controllers/singleMessageController");

router.route("/singleMessage").post(protect, addSingleMessage);
router.route("/singleMessage/:messageId").put(protect, editSingleMessage);
router.route("/singleMessage/:messageId").delete(protect, deleteSingleMessage);
router.route("/singleMessage/:messageId").get(protect, viewSingleMessage);
router.route("/:chatId").get(protect, viewAllMessagesInChat);

module.exports = router;
