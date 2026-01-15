import express from "express";
import { becomeAuthor, getAuthorProfile, getTopAuthors } from "../controllers/user.controller.js";
import protect from "../middleware/auth.middleware.js";
import allowRoles from "../middleware/role.middleware.js";


const router = express.Router();


router.get("/top-authors", getTopAuthors);
router.put("/become-author", protect, becomeAuthor);

router.get("/author/:id", getAuthorProfile)

export default router;