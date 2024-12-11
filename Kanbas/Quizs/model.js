

import mongoose from "mongoose";
import { quizSchema, attemptSchema, detailSchema } from "./schema.js";

// 创建模型，并显式指定模式
const QuizModel = mongoose.model("Quiz", quizSchema); // 对应集合名 "quizs"
const AttemptModel = mongoose.model("Attempt", attemptSchema);
const DetailModel = mongoose.model("Detail", detailSchema);

export { QuizModel, AttemptModel, DetailModel };
