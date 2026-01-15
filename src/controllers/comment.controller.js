import Comment from "../models/comment.js";

// add new comment (authenticated user)
export const addComment = async (req , res) => {
    try {
        const comment = await Comment.create({
            post: req.params.postId,
            author: req.user._id,
            content: req.body.content,
        })

        const populate = await comment.populate("author", "name role");

        
        res.status(201).json(populate)
    } catch (error) {
        console.log(error)
        res.status(500).json({ massage : "fail to add comment"})
    }
};

// get approved comment for a post (public)

export const getCommentsByPost = async (req , res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId })
        .populate("author", "name role")
        .sort({ createdAt: -1 });

        //group replies

        const map = {};
    comments.forEach(c => {
      c = c.toObject();
      c.replies = [];
      map[c._id] = c;
    });

    const roots = [];

    comments.forEach(c => {
      if (c.parent) {
        map[c.parent]?.replies.push(map[c._id]);
      } else {
        roots.push(map[c._id]);
      }
    });
        res.json(roots);
    } catch (error) {
        res.status(500).json({ message : "fail to fetch post"})
    }
};

// add reply

export const addReply = async (req, res) => {
    try {
        const reply = await Comment.create({
            post: req.params.postId,
            parent: req.params.commentId,
            author: req.user._id,
            content: req.body.content,
        });

        const populate = await reply.populate("author", "name");
        res.status(201).json(populate);
    } catch (error) {
        console.log(error)
        res.status(500).json({massage: "failed to add reply"})
    }
}

// approve comment (admin only)

// export const approveComment = async (req, res) => {
//     try {
//         const comment = await Comment.findById(req.params.id);

//         if(!comment) {
//             return res.status(404).json({ message: "comment not found"});
//         }

//         comment.isApproved = true;
//         await comment.save();

//         res.json({message: "comment approved"});
//     } catch (error) {
//         res.status(500).json({ message: "approval failed"});
//     }
// };

// delete comment (admin or comment owner) 

export const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if(!comment) {
            return res.status(404).json({message: "comment nnot found"});
        }

        if (
            comment.author.toString() !== req.user._id.toString() &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({ message: "Not authorized"});
        }

        await comment.deleteOne();
        res.json({ message: "comment deleted "})
    } catch (error) {
        console.log(error);
        res.status(500).json({ message : "delete failed"})
    }
}

//edite comment

export const updateComment =  async (req, res) => {
  try{
    const { content } = req.body;

    if (!content || !content.trim()) {
        return res.status(400).json({massage: "comment cen not be empty"})
    }

  const comment = await Comment.findByIdAndUpdate(
    req.params.id,
    { content },
    { new: true } // ✅ THIS IS CRITICAL
  );

    if (!comment) {
        return res.status(400).json({massage: "comment not found"})
    }

    if (comment.author.toString() !== req.user. _id.toString()) {
        return res.status(400).json({massage : "you can not edit comment"})
    }

    res.json(comment);
  } catch (error) {
    console.log(error);
    res.status(500).json({massage: "failed to update comment"});
  }
}