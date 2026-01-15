import post from "../models/post.js";
import Post from "../models/post.js";

// Create a new blog post (addmin / author)


export const createPost = async (req, res) => {
  try {
    const { title, content, category, tags, views } = req.body;

    const slug = title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, "-")
      .replace(/-+/g, "-");

    const post = await Post.create({
      title,
      slug,
      content,
      category: category.trim().toLowerCase(),
      tags: tags.map(t => t.trim().toLowerCase()),
      author: req.user._id,
      views,
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: "Post creation failed" });
  }
};
// get all posts (paginantion, filter)

export const getAllPosts = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const { category, tags } = req.query;

        const filter = { status: "published" };

        if (category) {
            filter.category = category.toLowerCase().trim();
        }


        if (tags) {
            filter.tags = { $regex: new RegExp(`^${tags}$`, "i")};
        }

        const posts = await Post.find(filter)
        .populate("author", "name username")
        .sort({ careatedAt: -1 })
        .skip(skip)
        .limit(limit);

        res.json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "failed to get posts"})
    }
};


//get singal page by slug

export const getpostbyslug = async (req, res) => {
    try {
    const post = await Post.findOneAndUpdate(
      { slug: req.params.slug, status: "published" },
      { $inc: { views: 1 } },
      { new: true }
    ).populate("author", "name username");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch post" });
  }
};

// update post


export const updatepost = async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);

        if(!post) {
            return res.status(404).json({ message: "post not found"})
        }

        if (post.author.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({message: "not authorized"});
        }

        Object.assign(post, req.body);
        await post.save();

        res.json(post);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message : "update failed"});
    }
}


//delete post


export const deletePost = async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);


        if(!post) {
            return res.status(404).json({ message : "post not found"});
        }

        if (
            req.user.role !== "admin" &&
            post.author.toString() !== req.user._id.toString()
        ) {
            return res.status(404).json({ message : "you are not allow to delete this post"});
        }

        await post.deleteOne();
        res.json({ message : "post deleted successfuly"});
    } catch (error) {
        res.status(500).json({ message : "delete failed"});
    }
};


//publish /unpublish


export const togglePublish = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (
      req.user.role !== "admin" &&
      post.author.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Not allowed to publish this post",
      });
    }


        post.status = post.status === "draft" ? "published" : "draft";
        await post.save();

        res.json({
      message: "Post status updated",
      status: post.status,
    });
    } catch (error) {
        console.log("SEARCH QUERY:", query);
        res.status(500).json({ message : "status update failed"})
    }
}

//search Controller

export const searchPost = async (req, res) => {
    try {
        const query = req.query.q

        if (!query) {
            return res.status(400).json({ message: "query search missing"});
        }

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const posts = await Post.find(
            {
                $text :  { $search: query },
                status : "published",
            },
            {
                score : {$meta : "textScore"},
            }
        )
        .sort({ score: { $meta: "textScore"} })
        .skip(skip)
        .limit(limit)
        .populate("author", "name username");

        res.json(posts);
    } catch (error) {
        res.status(500).json({ message : "search failed"});
    }
}

// get my all posts

export const getMyPosts = async (req, res) => {
 try{
    const posts = await Post.find({ author: req.user._id})
    .select("title status views createAt")
    .sort({ createdAt: -1 });

    res.json(posts);
 } catch (error) {
    res.status(500).json({massage : "faild to fetch your posts"});
 }
} 

//get top post

export const getTopPosts = async (req, res) => {
    try {
        const limit = Number(req.query.limit) || 5;

        const posts = await Post.find({ status: "published"})
        .populate("author", "name username")
        .sort({ views: -1 })
        .limit(limit)

        res.json(posts);
    } catch (error) {
        res.status(500).json({ massage: "faild to fatch posts"})
    }
}

//get all category

export const getCategory = async (req, res) => {
    try {
        const categories = await Post.distinct("category", {
            status: "published",
        })

        res.json(categories)
    } catch (error) {
        res.status(500).json({ massage: "Failed to fetch categories"})
    }
}

//get smart related posts

export const getSmartRelatedPosts = async (req, res) => {
  const { slug } = req.query;

  const current = await Post.findOne({ slug });
  if (!current) return res.json([]);

  const posts = await Post.find({
    _id: { $ne: current._id },
    status: "published",
  });

  const scored = posts.map(p => {
    let score = 0;

    if (p.category === current.category) score += 2;

    const sharedTags = p.tags.filter(t =>
      current.tags.includes(t)
    );
    score += sharedTags.length * 3;

    score += Math.floor(p.views / 100);

    return { post: p, score };
  });

  scored.sort((a, b) => b.score - a.score);

  res.json(scored.slice(0, 3).map(s => s.post));
};

//react to post 
export const reactToPost = async (req, res) => {
    try {
        const { reaction} = req.body;

        const post = await Post.findById(req.params.id);

        if(!post) return res.status(500).json({ massage: "post not found"});

        const valid = ["helpful", "love", "mindblown"];

        if(!valid.includes(reaction)) {
            return res.status(400).json({massage: "invalid reaction"})
        }

        const existing = post.reactedBy.find(
            r => r.user.toString() === req.user._id.toString()
        );

        if (existing) {
            post.reactions[existing.reaction]--;
            existing.reaction = reaction;
        } else{
            post.reactedBy.push({ user: req.user._id, reaction });
        }

        post.reactions[reaction]++;
        await post.save();

        res.json(post.reactions);
    } catch (error) {
        res.status(500).json({massage: "fail to add reaction"})
    }
}