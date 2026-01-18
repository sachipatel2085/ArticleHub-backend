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

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://articlehub.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (Postman, mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
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