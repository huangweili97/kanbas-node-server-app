import express from "express";
import session from "express-session";
import Lab5 from "./Lab5/index.js";
import cors from "cors";
import UserRoutes from "./Kanbas/Users/routes.js";
import "dotenv/config";
import CourseRoutes from "./Kanbas/Courses/routes.js";
import ModuleRoutes from "./Kanbas/Modules/routes.js";
import assignmentRoutes from "./Kanbas/Assignments/routes.js";
import EnrollmentsRoutes from "./Kanbas/Enrollments/routes.js";
import QuizRoutes from "./Kanbas/Quizs/routes.js";
import mongoose from "mongoose";
import "dotenv/config";

// const CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kanbas"
// mongoose.connect(CONNECTION_STRING);

mongoose
  .connect(process.env.MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));


const app = express(); //这里的 express() 是一个函数，调用它会生成一个应用实例 app
app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:3001",
        process.env.NETLIFY_URL, // 动态从环境变量中加载的来源
      ];
      // 如果请求来源是 undefined 或包含在 allowedOrigins 中
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // 允许请求
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`)); // 拒绝请求
      }
    },
  })
);

const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kanbas",
  resave: false,
  saveUninitialized: false,
};
if (process.env.NODE_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
    domain: process.env.NODE_SERVER_DOMAIN,
  };
}

app.use(session(sessionOptions));

app.use(express.json());
CourseRoutes(app);
Lab5(app);

UserRoutes(app);
ModuleRoutes(app);
assignmentRoutes(app);
EnrollmentsRoutes(app);
QuizRoutes(app);

app.listen(process.env.PORT || 4000);

// app 是 Express.js 的应用实例，代表你的服务器核心。它负责管理路由、中间件、以及服务器启动等工作
// 你传 app 给 Hello，是为了让这个函数给 app 注册一些新功能（路由）
