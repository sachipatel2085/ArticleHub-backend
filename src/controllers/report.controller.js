import AuthorReport from "../models/AuthorReport.js";

export const reportAuthor = async (req, res) => {
  const { reason } = req.body;
  const { authorId } = req.params;

  if (!reason || !reason.trim()) {
    return res.status(400).json({ message: "Reason required" });
  }

  await AuthorReport.create({
    author: authorId,
    reportedBy: req.user._id,
    reason,
  });

  res.json({ message: "Report submitted" });
};

export const getAuthorReports = async (req, res) => {
  try {
    const reports = await AuthorReport.find({ status: "pending" })
      .populate("author", "name")
      .populate("reportedBy", "name")
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: "Failed to load reports" });
  }
};