import assignmentModel from "./model.js"; // 导入 Assignment 的 Mongoose 模型
import courseModel from "../Courses/model.js"; // 导入 Course 的 Mongoose 模型

// 创建作业
export async function createAssignment(assignment) {
  // 验证 course.number 是否存在
  const courseExists = await courseModel.exists({ number: assignment.course });
  if (!courseExists) {
    throw new Error(`Course with number ${assignment.course} not found`);
  }
  return assignmentModel.create(assignment);
}

// 获取所有作业
export function findAssignments() {
  return assignmentModel.find();
}

// 根据课程的 course.number 获取作业
export function findAssignmentsForCourse(courseNumber) {
  return assignmentModel.find({ course: courseNumber });
}

// 更新作业
export function updateAssignment(assignmentId, assignmentUpdates) {
  return assignmentModel.findByIdAndUpdate(assignmentId, assignmentUpdates, {
    new: true, // 返回更新后的文档
  });
}

// 删除作业
export function deleteAssignment(assignmentId) {
  return assignmentModel.findByIdAndDelete(assignmentId);
}

// 根据作业 ID 获取作业
export function findAssignmentById(assignmentId) {
  return assignmentModel.findById(assignmentId);
}






// import Database from "../Database/index.js"; // 导入伪数据库

// // 创建作业
// export function createAssignment(assignment) {
//   const newAssignment = {
//     _id: Date.now().toString(),
//     ...assignment,
//   };
//   Database.assignments = [...Database.assignments, newAssignment];
//   return newAssignment;
// }

// // 获取所有作业
// export function findAssignments() {
//   return Database.assignments;
// }

// // 根据课程 ID 获取作业
// export function findAssignmentsForCourse(courseId) {
//   return Database.assignments.filter((assignment) => assignment.course === courseId);
// }

// // 更新作业
// export function updateAssignment(assignmentId, assignmentUpdates) {
//   const assignment = Database.assignments.find((a) => a._id === assignmentId);
//   Object.assign(assignment, assignmentUpdates);
//   return assignment;
// }

// // 删除作业
// export function deleteAssignment(assignmentId) {
//   Database.assignments = Database.assignments.filter((a) => a._id !== assignmentId);
// }


