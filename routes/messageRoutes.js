const express = require("express");
const router = express.Router();
const {
  getMessages,
  createMessage,
  updateMessage,
  deleteMessage,
  getMessagesByUserId,
} = require("../controllers/messageController");

router.route("/").get(getMessages).post(createMessage);

router
  .route("/:id")
  .put(updateMessage)
  .delete(deleteMessage)
  .get(getMessagesByUserId);

module.exports = router;
