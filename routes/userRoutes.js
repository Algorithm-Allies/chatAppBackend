const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUsers,
  getUser,
} = require("../controllers/userController");

router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/", getUsers);
router.get("/:id", getUser);

// Simple test route
router.get("/test", (req, res) => {
  res.status(200).json({ message: "Server is working!" });
});


module.exports = router;
