import express from 'express';
import protect from '../middleware/auth.middleware.js';
import allowRoles from '../middleware/role.middleware.js';
import {
    addComment,
    getCommentsByPost,
    deleteComment,
    updateComment,
    addReply,
} from "../controllers/comment.controller.js";


const router = express.Router();

//public
router.get("/post/:postId", getCommentsByPost);

//protected
router.post("/post/:postId", protect, allowRoles("admin", "author", "reader"), addComment);
router.post("/reply/:postId/:commentId", protect, addReply);
router.put("/:id",protect, updateComment);
router.delete("/:id", protect, deleteComment);

export default router;