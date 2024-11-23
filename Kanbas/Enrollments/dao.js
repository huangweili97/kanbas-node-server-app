
import Database from "../Database/index.js";

// Retrieve all enrollments for a specific user
export function findEnrollmentsForUser(userId) {
  const { enrollments } = Database;
  return enrollments.filter((enrollment) => enrollment.user === userId);
}




// Retrieve all enrollments (optional, for debugging or admin use)
export function findAllEnrollments() {
  const { enrollments } = Database;
  return enrollments;
}




export function enrollUserInCourse(userId, courseId) {
  const alreadyEnrolled = Database.enrollments.some(
    (enrollment) =>
      enrollment.user == userId && enrollment.course == courseId
  );

  if (!alreadyEnrolled) {
    const newEnrollment = {
      _id: Date.now().toString(),
      user: userId,
      course: courseId,
    };
    Database.enrollments.push(newEnrollment);
    console.log("Enrollments after enrolling:", Database.enrollments);
    return newEnrollment;
  } else {
    throw new Error("User is already enrolled in this course.");
  }
}

export function unenrollUserFromCourse(userId, courseId) {
  Database.enrollments = Database.enrollments.filter(
    (enrollment) =>
      !(enrollment.user === userId && enrollment.course === courseId)
  );
}




