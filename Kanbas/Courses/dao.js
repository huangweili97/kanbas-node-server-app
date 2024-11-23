import Database from "../Database/index.js";
export function findAllCourses() {
  return Database.courses;
}

export function findCoursesForEnrolledUser(userId) {
  const { courses, enrollments } = Database;
  const enrolledCourses = courses.filter((course) =>
    enrollments.some((enrollment) => enrollment.user === userId && enrollment.course === course._id));
  return enrolledCourses;
}

export function createCourse(course) {
  const newCourse = { ...course, _id: Date.now().toString() };
  Database.courses = [...Database.courses, newCourse];
  return newCourse;
}


export function updateCourse(courseId, courseUpdates) {
  const { courses } = Database;

  // 检查 courses 是否存在
  if (!courses) {
    throw new Error("Courses data is not available in the database.");
  }

  // 查找课程
  const course = courses.find((course) => course._id === courseId);

  // 如果找不到课程
  if (!course) {
    throw new Error(`Course with ID ${courseId} not found.`);
  }

  // 检查更新数据是否有效
  if (!courseUpdates || typeof courseUpdates !== "object") {
    throw new Error("Invalid course updates provided.");
  }

  // 合并更新数据
  Object.assign(course, courseUpdates);

  return course;
}

export function findCourseById(courseId) {
  const course = Database.courses.find((course) => course._id === courseId);
  return course;
}


export function deleteCourse(courseId) {
  const { courses, enrollments } = Database;
  Database.courses = courses.filter((course) => course._id !== courseId);
  Database.enrollments = enrollments.filter(
    (enrollment) => enrollment.course !== courseId
);}





