

import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Lesson 名称
    description: { type: String }, // Lesson 描述
    id: { type: String }, // Lesson ID，字符串格式，如 "L201"
  },
  { _id: false } // 不为每个嵌套文档生成额外的 `_id`
);

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // 模块名称
    description: { type: String }, // 模块描述
    course: { type: String, required: true }, // 课程编号
    lessons: [lessonSchema], // 嵌套的 Lesson 数组
  },
  { collection: "modules" }
);

export default schema;
