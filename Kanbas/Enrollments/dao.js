import model from "./model.js";

export async function findCoursesForUser(userId) {
 const enrollments = await model.find({ user: userId }).populate("course");
 return enrollments.map((enrollment) => enrollment.course);
}

export async function findUsersForCourse(courseId) {
 const enrollments = await model.find({ course: courseId }).populate("user");
 return enrollments.map((enrollment) => enrollment.user);
}

export function enrollUserInCourse(user, course) {
 return model.create({ user, course });
}

export function unenrollUserFromCourse(user, course) {
 return model.deleteOne({ user, course });
}

 

// import Database from "../Database/index.js";

// // Retrieve all enrollments for a specific user
// export function findEnrollmentsForUser(userId) {
//   const { enrollments } = Database;
//   return enrollments.filter((enrollment) => enrollment.user === userId);
// }




// // Retrieve all enrollments (optional, for debugging or admin use)
// export function findAllEnrollments() {
//   const { enrollments } = Database;
//   return enrollments;
// }




// export function enrollUserInCourse(userId, courseId) {
//   const alreadyEnrolled = Database.enrollments.some(
//     (enrollment) =>
//       enrollment.user == userId && enrollment.course == courseId
//   );

//   if (!alreadyEnrolled) {
//     const newEnrollment = {
//       _id: Date.now().toString(),
//       user: userId,
//       course: courseId,
//     };
//     Database.enrollments.push(newEnrollment);
//     console.log("Enrollments after enrolling:", Database.enrollments);
//     return newEnrollment;
//   } else {
//     throw new Error("User is already enrolled in this course.");
//   }
// }

// export function unenrollUserFromCourse(userId, courseId) {
//   Database.enrollments = Database.enrollments.filter(
//     (enrollment) =>
//       !(enrollment.user === userId && enrollment.course === courseId)
//   );
// }




