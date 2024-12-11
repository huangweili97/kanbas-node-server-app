import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    course: { type: String, required: true }, // 引用课程编号
    description: String,
    points: Number,
    dueDate: Date,
    availableFrom: Date,
    availableUntil: Date,
  },
  { collection: "assignments" }
);

export default assignmentSchema;
