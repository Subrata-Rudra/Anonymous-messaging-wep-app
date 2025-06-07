const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  createUser,
  sendMessage,
  getAllMessages,
  getRealtimeMessages,
  getRepliesCount,
  pauseUser,
  resumeUser,
  deleteUser,
} = require("../controllers/controller");

const router = express.Router();

router.route("/createUser").post(createUser);

router.route("/sendMessage").post(sendMessage);

router.route("/getAllMessages").get(protect, getAllMessages);

router.route("/getRealtimeMessages").get(protect, getRealtimeMessages);

router.route("/getRepliesCount").get(protect, getRepliesCount);

router.route("/pauseUser").put(protect, pauseUser);

router.route("/resumeUser").put(protect, resumeUser);

router.route("/deleteUser").delete(protect, deleteUser);

module.exports = router;
