const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  addSingleMessage,
  editSingleMessage,
  deleteSingleMessage,
  viewSingleMessage,
} = require("../controllers/singleMessage");

router.route("/singleMessage").post(protect, addSingleMessage);
router.route("/singleMessage/:messageId").put(protect, editSingleMessage);
router.route("/singleMessage/:messageId").delete(protect, deleteSingleMessage);
router.route("/singleMessage/:messageId").get(protect, viewSingleMessage);

module.exports = router;
