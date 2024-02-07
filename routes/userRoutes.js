const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  registerUser,
  loginUser,
  getUsers,
  getUser,
  getUserByUsername,
  updateProfilePhoto,
} = require("../controllers/userController");

router.post("/", registerUser);
router.post("/login", loginUser);

router.use(protect);
router.get("/", getUsers);
router.get("/:id", getUser);
router.get("/username/:username", getUserByUsername);
router.put("/:id/update-profile-picture",updateProfilePhoto)

module.exports = router;
