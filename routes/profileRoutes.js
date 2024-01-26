const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  updateUserProfile,
  getProfile,
} = require("../controllers/userProfileController");

router.route("/").put(protect, updateUserProfile);
router.route("/").get(protect, getProfile);
module.exports = router;
