import Database from "../Database/index.js"; // 导入伪数据库

// 创建作业
export function createAssignment(assignment) {
  const newAssignment = {
    _id: Date.now().toString(),
    ...assignment,
  };
  Database.assignments = [...Database.assignments, newAssignment];
  return newAssignment;
}

// 获取所有作业
export function findAssignments() {
  return Database.assignments;
}

// 根据课程 ID 获取作业
export function findAssignmentsForCourse(courseId) {
  return Database.assignments.filter((assignment) => assignment.course === courseId);
}

// 更新作业
export function updateAssignment(assignmentId, assignmentUpdates) {
  const assignment = Database.assignments.find((a) => a._id === assignmentId);
  Object.assign(assignment, assignmentUpdates);
  return assignment;
}

// 删除作业
export function deleteAssignment(assignmentId) {
  Database.assignments = Database.assignments.filter((a) => a._id !== assignmentId);
}


