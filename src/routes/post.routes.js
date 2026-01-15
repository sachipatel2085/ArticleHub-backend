import express from "express";
import {
    createPost,
    getAllPosts,
    getpostbyslug,
    updatepost,
    deletePost,
    togglePublish,
    getMyPosts,
    getTopPosts,
    getCategory,
    reactToPost,
    getSmartRelatedPosts,
} from "../controllers/post.controller.js";
import protect from "../middleware/auth.middleware.js";
import allowRoles from "../middleware/role.middleware.js";
import { searchPost } from "../controllers/post.controller.js";
import { blockRestrictedAuthor } from "../middleware/checkRestriction.js";



const router = express.Router();

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get all published blog posts
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of blog posts
 */

/**
 * @swagger
 * /api/posts/search:
 *   get:
 *     summary: Search blog posts
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Search results
 */


router.get("/search", searchPost);
router.get("/", getAllPosts);
router.get("/my", protect, allowRoles("admin", "author"), getMyPosts);
router.get("/top", getTopPosts);
router.get("/categories/all", getCategory);
router.get("/smart-related", getSmartRelatedPosts);
router.get("/:slug", getpostbyslug);

router.post(
  "/",
  protect,
  blockRestrictedAuthor,
  allowRoles("admin", "author"),
  createPost
);
router.post("/:id/react", protect, reactToPost);
router.put("/:id", protect, allowRoles("admin", "author"), updatepost);
router.delete("/:id", protect, allowRoles("admin", "author"), deletePost);
router.put("/:id/publish", blockRestrictedAuthor, protect, allowRoles("admin", "author"), togglePublish);


export default router;