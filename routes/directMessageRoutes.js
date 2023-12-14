const express = require("express");
const router = express.Router();

const {
  getDirectMessages,
  createDirectMessage,
  getDirectMessagesByUser,
  deleteDirectMessage,
} = require("../controllers/directMessageController");

router.route("/").get(getDirectMessages);
router.route("/:id").get(getDirectMessagesByUser).delete(deleteDirectMessage);

router.route("/:directUserId/:loggedInUserId").post(createDirectMessage);

module.exports = router;
