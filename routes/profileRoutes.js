const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const { updateUserProfile } = require("../controllers/userProfileController");

router.route("/").put(protect, updateUserProfile);

module.exports = router;
