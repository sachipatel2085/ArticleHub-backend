import Appeal from "../models/Appeal.js";

export const submitAppeal = async (req, res) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ message: "Appeal message required" });
  }

  const existing = await Appeal.findOne({
    author: req.user._id,
    status: "pending",
  });

  if (existing) {
    return res.status(400).json({
      message: "You already have a pending appeal",
    });
  }

  await Appeal.create({
    author: req.user._id,
    message,
  });

  res.json({ message: "Appeal submitted" });
};