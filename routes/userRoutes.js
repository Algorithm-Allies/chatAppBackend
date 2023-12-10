const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUsers,
  getUser,
  getUserByUsername,
} = require("../controllers/userController");

router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/", getUsers);
router.get("/:id", getUser);
router.get("/username/:username", getUserByUsername);

module.exports = router;
