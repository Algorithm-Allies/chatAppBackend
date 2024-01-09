const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  createDirectMessage,
  getAllDirectMessages,
} = require("../controllers/directMessageController");

router.route("/").post(protect, createDirectMessage);
router.route("/").get(protect, getAllDirectMessages);

module.exports = router;
