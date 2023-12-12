const express = require("express");
const router = express.Router();

const {
  getDirectMessages,
  createDirectMessage,
  getDirectMessagesByUser,
  deleteDirectMessage,
} = require("../controllers/directMessageController");

router.route("/").get(getDirectMessages);
router
  .route("/:id")
  .post(createDirectMessage)
  .get(getDirectMessagesByUser)
  .delete(deleteDirectMessage);

module.exports = router;
