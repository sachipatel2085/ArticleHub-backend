import User from "../models/user.js";
import Post from "../models/post.js"

export const becomeAuthor = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "author") {
      return res.status(400).json({ message: "Already an author" });
    }

    user.role = "author";
    await user.save();

    res.json({
      message: "You are now an author",
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to become author" });
  }
};

//get top author

export const getTopAuthors = async (req, res) => {
  try {
    const authors = await Post.aggregate([
      { $match: { status: "published" } },

      {
        $group: {
          _id: "$author",
          totalPosts: { $sum: 1 },
          totalViews: { $sum: "$views" },
        },
      },

      { $sort: { totalPosts: -1 } },
      { $limit: 3 },

      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: "$author" },

      {
        $project: {
          _id: 0,
          authorId: "$author._id",
          name: "$author.name",
          role: "$author.role",
          totalPosts: 1,
          totalViews: 1,
        },
      },
    ]);

    res.json(authors);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch top authors" });
  }
};

// get author by ID

export const getAuthorProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const author = await User.findById(id).select("name role bio");

    if(!author){
      return res.status(404).json({massage: "Author not found"})
    }

    const posts = await Post.find({
      author: id,
      status: "published",
    }).select("title slug category views content");

    const totalPosts = posts.length;
    const totalViews = posts.reduce((sum, p) => sum + p.views, 0);

    res.json({
      author,
      stats: {
        totalPosts,
        totalViews,
      },
      posts,
    });
  } catch (error) {
    res.status(500).json({massage: "failed to load author"})
  }
}