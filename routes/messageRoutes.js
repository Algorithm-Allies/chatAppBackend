const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  getChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../controllers/messageController");

router.route("/").get(protect, getChats);

router.route("/group").post(protect, createGroupChat);

router.route("/rename").put(protect, renameGroup);


router.route("/groupAdd").put(protect, addToGroup);

router.route("/groupRemove").put(protect, removeFromGroup);
//router.route("/:id").put(updateMessage).delete(deleteMessage);

module.exports = router;
