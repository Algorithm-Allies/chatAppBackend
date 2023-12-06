const express = require("express");
const router = express.Router();

const { getChannels } = require("../controllers/channelController");

router.route("/").get(getChannels);
