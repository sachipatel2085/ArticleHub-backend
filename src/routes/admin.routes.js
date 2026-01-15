import express from "express";
import protect from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.js";
import {
        deletePostByAdmin,
        denyAuthorReport,
        getAllPostsForAdmin, 
        getAllUsers, 
        getAppeals, 
        getDashboardStats, 
        restrictAuthor, 
        reviewAppeal, 
        updatePostStatus, 
        updateUserRole
    } from "../controllers/admin.controller.js";
import { getAuthorReports, reportAuthor } from "../controllers/report.controller.js";

const router = express.Router();

router.get("/stats", protect, requireAdmin, getDashboardStats);
router.get("/posts", protect, requireAdmin, getAllPostsForAdmin);
router.put("/posts/:id/status", protect, requireAdmin, updatePostStatus);
router.delete("/posts/:id", protect, requireAdmin, deletePostByAdmin);
router.get("/users", protect, requireAdmin, getAllUsers);
router.post(
  "/report-author/:authorId",
  protect,
  reportAuthor
);
router.put(
  "/restrict-author/:authorId",
  protect,
  requireAdmin,
  restrictAuthor
);
router.get(
  "/author-reports",
  protect,
  requireAdmin,
  getAuthorReports
);
router.get("/appeals", protect, requireAdmin, getAppeals);
router.put(
  "/appeals/:id",
  protect,
  requireAdmin,
  reviewAppeal
);
router.put(
  "/author-reports/:id/deny",
  protect,
  requireAdmin,
  denyAuthorReport
);
router.put("/users/:id/role", protect, requireAdmin, updateUserRole);
export default router;