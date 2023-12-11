const express = require("express");
const router = express.Router();

const { getDirectMessages } = require("../controllers/directMessageController");

router.route("/").get(getDirectMessages);

module.exports = router;
