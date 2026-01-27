const Chat = require("../models/Chat");
const menuTree = require("../utils/menuTree");

const chatHandler = async (req, res) => {
  try {
    let { option } = req.body;
    if (!option) option = "start";

    const node = menuTree[option] || menuTree["start"];

    await Chat.create({
      userid: req.user._id,
      user: option,
      bot: node.message,
    });

    res.json({ reply: node.message, options: node.options });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Chat handler failed" });
  }
};

const getHistory = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authorized" });

  const chats = await Chat.find({ userid: req.user._id }).sort({
    timestamp: 1,
  });
  res.json(chats);
};

module.exports = { chatHandler, getHistory };
