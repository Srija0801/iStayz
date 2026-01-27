const express = require("express");
const { chatHandler, getHistory } = require("../controllers/chatController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/chat", protect, chatHandler);
router.get("/history", protect, getHistory);

module.exports = router;
