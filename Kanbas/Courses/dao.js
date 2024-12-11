import model from "./model.js";

export function findAllCourses() {
  return model.find();
}

export function createCourse(course) {
  delete course._id;
  return model.create(course);

}

export function updateCourse(courseId, courseUpdates) {
  return model.updateOne({ _id: courseId }, courseUpdates);
}

export function findCourseById(courseId) {
  return model.findById({ _id: courseId });
}


export function deleteCourse(courseId) {
  return model.deleteOne({ _id: courseId });
 }
 




