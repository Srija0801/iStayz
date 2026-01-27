const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  user: String,
  bot: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Chat", chatSchema);
