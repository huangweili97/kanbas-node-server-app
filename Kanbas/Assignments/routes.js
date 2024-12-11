import * as dao from "./dao.js"; // 导入 Assignment 的 DAO 层函数

export default function AssignmentRoutes(app) {
  // 获取所有作业
  app.get("/api/assignments", async (req, res) => {
    try {
      const assignments = await dao.findAssignments();
      res.json(assignments);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  // 获取某课程的作业（通过 course.number）
  app.get("/api/courses/:courseNumber/assignments", async (req, res) => {
    const { courseNumber } = req.params;
    try {
      const assignments = await dao.findAssignmentsForCourse(courseNumber);
      res.json(assignments);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  // 创建作业
  app.post("/api/assignments", async (req, res) => {
    const { course, title, description, points, dueDate, availableFrom, availableUntil } = req.body;
    if (!course) {
      return res.status(400).send("Course number is required");
    }
    try {
      const newAssignment = await dao.createAssignment({
        course, // 注意这里是 course.number
        title,
        description,
        points,
        dueDate,
        availableFrom,
        availableUntil,
      });
      res.status(201).json(newAssignment);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  // 更新作业
  app.put("/api/assignments/:assignmentId", async (req, res) => {
    const { assignmentId } = req.params;
    try {
      const updatedAssignment = await dao.updateAssignment(assignmentId, req.body);
      if (!updatedAssignment) {
        res.status(404).send("Assignment not found");
      } else {
        res.json(updatedAssignment);
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  // 删除作业
  app.delete("/api/assignments/:assignmentId", async (req, res) => {
    const { assignmentId } = req.params;
    try {
      await dao.deleteAssignment(assignmentId);
      res.sendStatus(204);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  // 根据作业 ID 获取作业
app.get("/api/assignments/:assignmentId", async (req, res) => {
  const { assignmentId } = req.params;
  try {
    const assignment = await dao.findAssignmentById(assignmentId);
    if (!assignment) {
      res.status(404).send("Assignment not found");
    } else {
      res.json(assignment);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});
}






// import * as dao from "./dao.js"; // 导入数据访问层函数

// export default function AssignmentRoutes(app) {
//   // 获取所有作业
//   app.get("/api/assignments", (req, res) => {
//     const assignments = dao.findAssignments();
//     res.json(assignments);
//   });

//   app.get("/api/assignments/:assignmentId", (req, res) => {
//     const { assignmentId } = req.params;
//     const assignment = dao.findAssignments().find((a) => a._id === assignmentId);
//     if (assignment) {
//       res.json(assignment);
//     } else {
//       res.status(404).send("Assignment not found");
//     }
//   });
  
//   // 获取某课程的作业
//   app.get("/api/courses/:courseId/assignments", (req, res) => {
//     const { courseId } = req.params;
//     try {
//       const assignments = dao.findAssignmentsForCourse(courseId);
//       res.json(assignments);
//     } catch (error) {
//       res.status(500).send(error.message);
//     }
//   });

//   app.post("/api/assignments", (req, res) => {
//     const { course, title, description, points, dueDate, availableFrom, availableUntil } = req.body;
//     if (!course) {
//       return res.status(400).send("Course ID is required");
//     }
//     try {
//       const newAssignment = dao.createAssignment({
//         course,
//         title,
//         description,
//         points,
//         dueDate,
//         availableFrom,
//         availableUntil,
//       });
//       res.status(201).json(newAssignment);
//     } catch (error) {
//       res.status(500).send(error.message);
//     }
//   });
  
     

//   app.put("/api/assignments/:assignmentId", (req, res) => {
//     const { assignmentId } = req.params;
//     try {
//       const updatedAssignment = dao.updateAssignment(assignmentId, req.body);
//       if (!updatedAssignment) {
//         res.status(404).send("Assignment not found");
//       } else {
//         res.json(updatedAssignment);
//       }
//     } catch (error) {
//       res.status(500).send(error.message);
//     }
//   });
  

//   // 删除作业
//   app.delete("/api/assignments/:assignmentId", (req, res) => {
//     const { assignmentId } = req.params;
//     try {
//       dao.deleteAssignment(assignmentId);
//       res.sendStatus(204);
//     } catch (error) {
//       res.status(500).send(error.message);
//     }
//   });
  

// }

