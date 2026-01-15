import User from "../models/user.js";
import Post from "../models/post.js";
import Comment from "../models/comment.js";
import AuthorReport from "../models/AuthorReport.js";
import Appeal from "../models/Appeal.js";

export const getDashboardStats = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const authors = await User.countDocuments({ role: "author" });
    const posts = await Post.countDocuments();
    const publishedPosts = await Post.countDocuments({ status: "published" });
    const comments = await Comment.countDocuments();

    res.json({
      users,
      authors,
      posts,
      publishedPosts,
      comments,
    });
  } catch {
    res.status(500).json({ message: "Failed to load stats" });
  }
};

//get all post by admin 

export const getAllPostsForAdmin = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch {
    res.status(500).json({ message: "Failed to load posts" });
  }
};

//change post status by admin
export const updatePostStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["draft", "published"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.status = status;
    await post.save();

    res.json({ message: "Status updated", status });
  } catch {
    res.status(500).json({ message: "Failed to update status" });
  }
};

//delete post by admin 

export const deletePostByAdmin = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch {
    res.status(500).json({ message: "Failed to delete post" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("name email role createdAt")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch {
    res.status(500).json({ message: "Failed to load users" });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const { id } = req.params;

    if (!["reader", "author"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ❌ Prevent changing admin role
    if (user.role === "admin") {
      return res.status(403).json({ message: "Cannot modify admin" });
    }

    user.role = role;
    await user.save();

    res.json({ message: "Role updated", role });
  } catch {
    res.status(500).json({ message: "Failed to update role" });
  }
};

export const restrictAuthor = async (req, res) => {
  const { authorId } = req.params;

  const author = await User.findById(authorId);
  if (!author) {
    return res.status(404).json({ message: "Author not found" });
  }

  author.isRestricted = true;
  await author.save();

  await AuthorReport.updateMany(
    { author: authorId },
    { status: "reviewed" }
  );

  res.json({ message: "Author restricted" });
};

export const denyAuthorReport = async (req, res) => {
  const report = await AuthorReport.findById(req.params.id);

  if (!report) {
    return res.status(404).json({ message: "Report not found" });
  }

  report.status = "reviewed";
  await report.save();

  res.json({ message: "Report denied" });
};

export const getAppeals = async (req, res) => {
  const appeals = await Appeal.find({ status: "pending" })
    .populate("author", "name email", "post", "title slug")
    .sort({ createdAt: -1 });

  res.json(appeals);
};

export const reviewAppeal = async (req, res) => {
  const { status } = req.body; // approved | rejected

  const appeal = await Appeal.findById(req.params.id);
  if (!appeal) {
    return res.status(404).json({ message: "Appeal not found" });
  }

  appeal.status = status;
  await appeal.save();

  if (status === "approved") {
    await User.findByIdAndUpdate(appeal.author, {
      isRestricted: false,
    });
  }

  res.json({ message: `Appeal ${status}` });
};