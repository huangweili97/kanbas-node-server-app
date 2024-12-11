import express from "express";
import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import { AttemptModel, QuizModel, DetailModel } from "./model.js";


export default function QuizRoutes(app) {

  //获得全部的quiz list
  app.get("/api/courses/:courseId/quizzes", async (req, res) => {
    const { courseId } = req.params; // 从 req.params 获取 courseId
    //console.log("Received request for courseId:", courseId); // 打印收到的 courseId
    
    try {
      if (!courseId) {
        console.error("No courseId provided in request"); // 如果没有提供 courseId
        return res.status(400).send("courseId is required");
      }
  
      const course = await courseDao.findCourseById(courseId); // 查找对应的 course
      //console.log("Course fetched from database:", course); // 打印找到的 course
  
      if (!course) {
        //console.error(`No course found for courseId: ${courseId}`); // 如果没有找到 course
        return res.status(404).send("Course not found");
      }
  
      const quizzes = await dao.findQuizzesByCourseNumber(course.number); // 根据 course.number 查找 Quiz
      //console.log("Quizzes fetched for course:", quizzes); // 打印找到的 quizzes
  
      res.json(quizzes);
    } catch (error) {
      console.error("Error fetching quizzes:", error.message); // 打印错误信息
      res.status(500).send(error.message);
    }
  });

  //根据特定quiz，获得该quiz的detail
app.get("/api/quizzes/details/:quizId", async (req, res) => {
  const { quizId } = req.params;
  //console.log("backend received quiz Id:", quizId);

  try {
    if (!quizId) {
      return res.status(400).send("quizId is required");
    }

    // 根据 quizId 获取 quiz
    const quiz = await dao.findQuizById(quizId);
    //console.log("backend found quiz:", quiz);


    if (!quiz || !quiz.quizNumber) {
      return res.status(404).send("Quiz not found or quizNumber missing");
    }

    // 根据 quizNumber 获取 detail
    const details = await dao.findDetailsByQuizNumber(quiz.quizNumber);
    //console.log("backend found quiz detail:", details);


    if (!details) {
      return res.status(404).send("Details not found");
    }

    res.json(details);
  } catch (error) {
    console.error("Error fetching quiz details:", error.message);
    res.status(500).send(error.message);
  }
});




// 更新 某个特定 Quiz的 detail Route，同时更新 Quiz
app.put("/api/quizzes/details/:detailId", async (req, res) => {
  const { detailId } = req.params;
  const detailsData = req.body;

  //console.log("Received request to update detail ID:", detailId);
  //console.log("Update data:", detailsData);

  try {
    if (!detailId) {
      return res.status(400).send("Detail ID is required");
    }

    // 更新 details 集合
    const updatedDetail = await dao.updateQuizDetailById(detailId, detailsData);

    if (!updatedDetail) {
      return res.status(404).send("Detail not found");
    }

    // 更新 quiz 集合 (同步标题和时间等信息)
    const { quizNumber, title, availableDate, dueDate, untilDate } = detailsData;

    if (quizNumber) {
      const updatedQuiz = await dao.updateQuizByQuizNumber(quizNumber, {
        title,
        availableDate,
        dueDate,
        availableUntil: untilDate,
      });

      if (!updatedQuiz) {
        console.error(`Quiz with quizNumber ${quizNumber} not found`);
        return res.status(404).send("Quiz not found for the corresponding detail");
      }

      //console.log("Quiz successfully updated:", updatedQuiz);
    } else {
      console.warn("No quizNumber found in updated details, skipping quiz sync");
    }

    res.json(updatedDetail);
  } catch (error) {
    console.error("Error updating quiz detail and syncing quiz:", error.message);
    res.status(500).send(error.message);
  }
});


// 根据quizId找到某个特定的quiz
app.get("/api/quizzes/:quizId", async (req, res) => {
  try {
    const quiz = await dao.findQuizById(req.params.quizId); // 从 DAO 获取 quiz 数据
    if (quiz) {
      res.json(quiz);
    } else {
      res.status(404).send("Quiz not found");
    }
  } catch (error) {
    console.error("Error in GET /api/quizzes/:quizId:", error);
    res.status(500).send("Internal Server Error");
  }
});

//根据quiz id更新quiz同时更新detail
app.put("/api/quizzes/:quizId", async (req, res) => {
  const quizId = req.params.quizId;
  const { quizData } = req.body;

  try {
    // Update the Quiz
    const updatedQuiz = await dao.updateQuiz(quizId, quizData);
    if (!updatedQuiz) {
      return res.status(404).send("Quiz not found");
    }

    const updatedQuizDetail = await dao.updateQuizDetailByQuizNumber(
      updatedQuiz.quizNumber,
      {
        title: updatedQuiz.title,
        points: updatedQuiz.totalPoints, // 同步总分数
        dueDate: updatedQuiz.dueDate,
        availableDate: updatedQuiz.availableDate,
        untilDate: updatedQuiz.availableUntil,
      }
    );

    if (!updatedQuizDetail) {
      return res
        .status(404)
        .send("Quiz detail not found for the provided quizNumber");
    }

    // Respond with the updated data
    res.json({
      message: "Quiz and Quiz Detail updated successfully",
      updatedQuiz,
      updatedQuizDetail,
    });
  } catch (error) {
    console.error("Error updating quiz and quiz detail:", error.message);
    res.status(500).send("Failed to update quiz and quiz detail.");
  }
});

// 创建新的quiz
app.post("/api/quizzes/course/:courseId", async (req, res) => {
  try {
    const courseId = req.params.courseId;
    console.log("CourseId delivered:", courseId);

    // Generate quizNumber based on courseNumber and quizth
    const course = await courseDao.findCourseById(courseId);
    console.log("Course  found:", course);
    const courseNumber = course.number; // Assuming courseNumber exists in CourseModel

     // Find all quizzes for this course to determine quizth
     const quizzes = await dao.findQuizzesByCourseNumber(courseNumber);
    
     // 获取当前课程中最大的 quizth
    const maxQuizth = quizzes.reduce((max, quiz) => {
      const match = quiz.quizNumber.match(/Q(\d+)$/); // 提取quizth数字部分
      if (match) {
        const currentQuizth = parseInt(match[1], 10); // 转换为数字
        return Math.max(max, currentQuizth);
      }
      return max;
    }, 0);

    const quizth = maxQuizth + 1; // 新的 quizth 为最大值加 1
 
    
    const quizNumber = `${courseNumber}-Q${quizth}`;
    // Create new quiz
    const newQuiz = await dao.createQuiz({
      ...req.body,
      quizth,
      quizNumber,
      course: courseNumber,
    });

    res.status(201).json(newQuiz);
  } catch (error) {
    console.error("Failed to create quiz:", error);
    res.status(500).send(error.message);
  }
});

//创新的新detail
app.post("/api/quizzes/details", async (req, res) => {
  try {
    const newDetails = await dao.createQuizDetails(req.body);
    res.status(201).json(newDetails);
  } catch (error) {
    console.error("Failed to create quiz details:", error);
    res.status(500).send(error.message);
  }
});

// 删除 Quiz
app.delete("/api/quizzes/:quizId", async (req, res) => {
  const { quizId } = req.params;

  try {
    if (!quizId) {
      return res.status(400).send("Quiz ID is required");
    }

    const deletedQuiz = await dao.deleteQuizById(quizId);

    if (!deletedQuiz) {
      return res.status(404).send("Quiz not found");
    }

    // 删除 Quiz 的详细信息
    await dao.deleteQuizDetailByQuizNumber(deletedQuiz.quizNumber);

    res.json({ message: "Quiz deleted successfully", deletedQuiz });
  } catch (error) {
    console.error("Error deleting quiz:", error.message);
    res.status(500).send("Failed to delete quiz.");
  }
});


// 发布或取消发布 Quiz
app.put("/api/quizzes/:quizId/publish", async (req, res) => {
  const { quizId } = req.params;
  const { isPublished } = req.body;

  try {
    const updatedQuiz = await dao.updateQuiz(quizId, { isPublished });
    if (!updatedQuiz) {
      return res.status(404).send("Quiz not found");
    }
    res.json(updatedQuiz);
  } catch (error) {
    console.error("Error publishing/unpublishing quiz:", error.message);
    res.status(500).send("Failed to publish/unpublish quiz.");
  }
});

// 复制 Quiz
app.post("/api/quizzes/:quizId/copy", async (req, res) => {
  const { quizId } = req.params;

  try {
    const originalQuiz = await dao.findQuizById(quizId);
    if (!originalQuiz) {
      return res.status(404).send("Quiz not found");
    }

    // 创建新的 Quiz，继承原 Quiz 的数据
    const copiedQuizData = {
      ...originalQuiz.toObject(),
      _id: undefined, // 清除 _id，MongoDB 会生成新的 _id
      quizNumber: `${originalQuiz.quizNumber}-COPY`, // 更新 quizNumber
      isPublished: false, // 复制的 Quiz 默认未发布
      title: `${originalQuiz.title} (Copy)`, // 更新标题
    };

    const newQuiz = await dao.createQuiz(copiedQuizData);
    res.status(201).json(newQuiz);
  } catch (error) {
    console.error("Error copying quiz:", error.message);
    res.status(500).send("Failed to copy quiz.");
  }
});

// Get attempts for a quiz
app.get("/api/quizzes/attempts/:quizNumber", async (req, res) => {
  try {
    const { quizNumber } = req.params;
    const { studentId } = req.query;;
    const attempts = await dao.findAttemptsByQuizAndStudent(quizNumber, studentId);
    res.json(attempts);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to fetch attempts.");
  }
});

// app.post("/api/quizzes/attempts/:quizNumber", async (req, res) => {
//   try {
//     const { quizNumber } = req.params;
//     const { studentId, answers } = req.body;

//     console.log("quizNumber and studentId is", quizNumber, studentId);

//     if (!studentId || !answers || !quizNumber) {
//       return res
//         .status(400)
//         .send("Student ID, quiz number, and answers are required.");
//     }

//     // 计算得分并更新答案的正确性
//     const { score, updatedAnswers } = await dao.calculateScore(
//       quizNumber,
//       answers
//     );

//      // 查找当前学生的尝试记录
// const record = await dao.findAttemptsByQuizAndStudent(quizNumber, studentId);

//     // 确定新的尝试号
//     const attemptNumber = record ? record.attempts.length + 1 : 1;

//     // 创建新的尝试
//     const newAttempt = {
//       attemptNumber,
//       attemptDate: new Date(),
//       score,
//       answers: updatedAnswers.map((answer, index) => ({
//         questionNumber: answers[index].questionNumber,
//         selectedAnswer: answer.selectedAnswer,
//         isCorrect: answer.isCorrect,
//       })),
//     };

   

// // 如果记录存在则更新，否则创建新的尝试记录
// if (!record) {
//   await dao.createAttempt(quizNumber, studentId, newAttempt);
// } else {
//   await dao.updateAttempt(record, newAttempt);
// }

//     res.status(201).json(newAttempt);
//   } catch (err) {
//     console.error("Failed to submit quiz attempt:", err.message);
//     res.status(500).send("Failed to submit quiz attempt.");
//   }
// });
app.post("/api/quizzes/attempts/:courseId/:quizNumber", async (req, res) => {
  try {
    const { quizNumber, courseId } = req.params;
    const { studentId, answers } = req.body;

    console.log("quizNumber and studentId is", quizNumber, studentId);

    if (!studentId || !studentId || !answers || !quizNumber) {
      return res
        .status(400)
        .send("CourseId, Student ID, quiz number, and answers are required.");
    }

    // 计算得分并更新答案的正确性
    const { score, updatedAnswers } = await dao.calculateScore(
      quizNumber,
      answers
    );

    // 查找当前学生的尝试记录
    const record = await AttemptModel.findOne({ quizNumber, studentId });
    
    


    // 确定新的尝试号
    const attemptNumber = record ? record.attempts.length + 1 : 1;

    // 创建新的尝试
    const newAttempt = {
      courseId,
      attemptNumber,
      attemptDate: new Date(),
      score,
      answers: updatedAnswers.map((answer, index) => ({
        questionNumber: answers[index].questionNumber,
        selectedAnswer: answer.selectedAnswer,
        isCorrect: answer.isCorrect,
      })),
    };

    if (!record) {
      // 如果之前没有记录，创建新的 Attempt 记录
      await dao.createAttempt(courseId, quizNumber, studentId, newAttempt);
    } else {
      // 如果已有记录，追加新尝试
      record.attempts.push(newAttempt);
      await record.save();
    }

    res.status(201).json(newAttempt);
  } catch (err) {
    console.error("Failed to submit quiz attempt:", err.message);
    res.status(500).send("Failed to submit quiz attempt.");
  }
});
















app.delete("api/quizzes/:quizId", async (req, res) => {
  try {
    await dao.deleteQuiz(req.params.quizId);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Details routes


app.post("api/quizzes/details", async (req, res) => {
  try {
    const newDetails = await dao.createDetails(req.body);
    res.status(201).json(newDetails);
  } catch (error) {
    res.status(500).send(error.message);
  }
});


// 根据id更新quiz
app.put("/api/quizzes/:quizId", async (req, res) => {
  try {
    const updatedQuiz = await dao.updateQuiz(req.params.quizId, req.body);
    if (!updatedQuiz) {
      return res.status(404).send("Quiz not found");
    }
    res.json(updatedQuiz);
  } catch (error) {
    console.error(`Error updating quiz ${req.params.quizId}:`, error.message);
    res.status(500).send("Failed to update quiz. Please try again.");
  }
});



app.get("/api/courses/:courseId/students/:studentId/grades", async (req, res) => {
  const { courseId, studentId } = req.params;

  try {
    const course = await courseDao.findCourseById(courseId);

    if (!course) {
      return res.status(404).send("Course not found");
    }

    const attempts = await dao.findAttemptsByStudentAndCourse(
      studentId,
      courseId
    );

    res.json(attempts);
  } catch (error) {
    console.error("Error fetching grades:", error.message);
    res.status(500).send("Failed to fetch grades.");
  }
});

app.get("/api/quizzes/number/:quizNumber", async (req, res) => {
  const { quizNumber } = req.params;
  try {
    if (!quizNumber) {
      return res.status(400).send("Quiz name is required");
    }

    const quiz = await dao.findQuizByNumber(quizNumber);
    if (!quiz) {
      return res.status(404).send("Quiz not found");
    }

    res.json(quiz);
  } catch (error) {
    
    res.status(500).send("Failed to fetch quiz by number.");
  }
});






}


