
import * as dao from "./dao.js";

export default function EnrollmentsRoutes(app) {
  // Get all enrollments for a specific user
  app.get("/api/enrollments/:userId", (req, res) => {
    const { userId } = req.params;
    const enrollments = dao.findEnrollmentsForUser(userId);
    res.send(enrollments);
  });

  // Enroll a user in a course
  app.post("/api/enrollments", (req, res) => {
    const { userId, courseId } = req.body;
    try {
      const newEnrollment = dao.enrollUserInCourse(userId, courseId);
      res.status(201).send(newEnrollment);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  });



  app.delete("/api/enrollments/:userId/:courseId", (req, res) => {
    const { userId, courseId } = req.params;
    dao.unenrollUserFromCourse(userId, courseId);
    res.sendStatus(204);
  });

  
}
