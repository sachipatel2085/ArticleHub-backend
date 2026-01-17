import express from 'express';
// import dotenv from 'dotenv';
// dotenv.config();
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import postRoutes from "./routes/post.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import adminRoutes from "./routes/admin.routes.js"
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import userRouter from './routes/user.routes.js';
import appealRoutes from './routes/appeal.routes.js';

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/user", userRouter)
app.use("/api/admin", adminRoutes);
app.use("/api/appeals", appealRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;