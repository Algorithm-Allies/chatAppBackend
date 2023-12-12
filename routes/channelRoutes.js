const express = require("express");
const router = express.Router();

const {
  getChannels,
  getChannelById,
  createChannel,
  deleteChannel,
} = require("../controllers/channelController");

router.route("/").get(getChannels);
router.route("/:id").get(getChannelById).delete(deleteChannel);
router.route("/:userId").post(createChannel);

module.exports = router;
