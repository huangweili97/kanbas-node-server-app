import { QuizModel, AttemptModel, DetailModel } from "./model.js";


// Quiz DAO functions
export const findQuizzesByCourseNumber = async (courseNumber) => {
  try {
    // 查找所有符合条件的 Quiz
    const quizzes = await QuizModel.find({ course: courseNumber });
    //console.log(`Quizzes found for course ${courseNumber}:`, quizzes);
    return quizzes;
  } catch (error) {
    console.error(`Error finding quizzes for course ${courseNumber}:`, error);
    throw error; // 抛出错误供调用方处理
  }
};


// 根据 quizId 查找 quiz
export const findQuizById = async (quizId) => {
  try {
    const quiz = await QuizModel.findById(quizId);
    if (!quiz) {
      console.warn(`Quiz with ID ${quizId} not found.`);
      return null; // 或者选择抛出错误
    }
    console.log(`Quiz found for ID ${quizId}:`, quiz);
    return quiz;
  } catch (error) {
    console.error(`Error finding quiz with ID ${quizId}:`, error.message);
    throw error;
  }
};


// 根据 quizNumber 查找 quiz
export const findQuizByNumber = async (quizNumber) => {
  try {
    const quiz = await QuizModel.findOne( {quizNumber});
    //console.log(`Quiz found for Id ${quizId}:`, quiz);

    // 如果查询不到，返回 null 并打印日志
    if (!quiz) {
      console.log(`Quiz not found for quizNumber: ${quizNumber}`);
      return null;
    }
    return quiz;
    
  } catch (error) {
    console.error("Error finding quiz by ID:", error.message);
    throw error;
  }
};

// 根据 quizNumber 查找 detail
export const findDetailsByQuizNumber = async (quizNumber) => {
  try {
    const detail = await DetailModel.findOne({ quizNumber });
    //console.log(`Detail found for quiz number ${quizNumber}:`, detail);
    return detail;
  } catch (error) {
    console.error("Error finding details by quizNumber:", error.message);
    throw error;
  }
};

// 根据 detailId 更新 Quiz detail 
export const updateQuizDetailById = async (detailId, detailsData) => {
  try {
    const updatedDetail = await DetailModel.findByIdAndUpdate(
      detailId, // 查找的 ID
      detailsData, // 更新的数据
      { new: true } // 返回更新后的文档
    );

   // console.log(`Updated detail for ID ${detailId}:`, updatedDetail);
    return updatedDetail;
  } catch (error) {
    console.error("Error updating quiz detail by ID:", error.message);
    throw error;
  }
};

// 根据 quizNumber 更新 Quiz
export const updateQuizByQuizNumber = async (quizNumber, updateData) => {
  try {
    const updatedQuiz = await QuizModel.findOneAndUpdate(
      { quizNumber },
      updateData,
      { new: true }
    );
    //console.log(`Updated quiz for quizNumber ${quizNumber}:`, updatedQuiz);
    return updatedQuiz;
  } catch (error) {
    console.error("Error updating quiz by quizNumber:", error.message);
    throw error;
  }
};


// // 根据id更新quiz，同时更新detail
// export const updateQuiz = async (quizId, quizData) => {
//   try {
//     const updatedQuiz = await QuizModel.findByIdAndUpdate(
//       quizId,
//       quizData,
//       { new: true, runValidators: true }
//     );
//     if (!updatedQuiz) {
//       console.warn(`Quiz with ID ${quizId} not found`);
//     }
//     return updatedQuiz;
//   } catch (error) {
//     console.error(`Error updating quiz ${quizId}:`, error.message);
//     throw error;
//   }
// };
export const updateQuiz = async (quizId, quizData) => {
  try {
    // 计算总分
    if (quizData.questions && Array.isArray(quizData.questions)) {
      const totalPoints = quizData.questions.reduce((sum, question) => {
        const points = question.points || 0; // 确保 points 存在
        return sum + points;
      }, 0);
      quizData.totalPoints = totalPoints; // 将总分存储到 quizData 中
    }

    // 更新 Quiz
    const updatedQuiz = await QuizModel.findByIdAndUpdate(
      quizId,
      quizData,
      { new: true, runValidators: true }
    );

    if (!updatedQuiz) {
      console.warn(`Quiz with ID ${quizId} not found`);
    }

    return updatedQuiz;
  } catch (error) {
    console.error(`Error updating quiz ${quizId}:`, error.message);
    throw error;
  }
};


// 通过quiz的number 更新detail
export const updateQuizDetailByQuizNumber = async (quizNumber, quizDetailData) => {
  try {

    const updatedQuizDetail = await DetailModel.findOneAndUpdate(
      { quizNumber },
      quizDetailData,
      { new: true, runValidators: true }
    );

    if (!updatedQuizDetail) {
      console.warn(`Quiz Detail with quizNumber ${quizNumber} not found`);
    }

    return updatedQuizDetail;
  } catch (error) {
    console.error(`Error updating quiz detail for quizNumber ${quizNumber}:`, error.message);
    throw error;
  }
};

// 删除 Quiz
export const deleteQuizById = async (quizId) => {
  try {
    const deletedQuiz = await QuizModel.findByIdAndDelete(quizId);

    if (!deletedQuiz) {
      console.warn(`Quiz with ID ${quizId} not found`);
    }

    return deletedQuiz;
  } catch (error) {
    console.error(`Error deleting quiz with ID ${quizId}:`, error.message);
    throw error;
  }
};

// 删除 Quiz Detail
export const deleteQuizDetailByQuizNumber = async (quizNumber) => {
  try {
    const deletedDetail = await DetailModel.findOneAndDelete({ quizNumber });

    if (!deletedDetail) {
      console.warn(`Quiz Detail with quizNumber ${quizNumber} not found`);
    }

    return deletedDetail;
  } catch (error) {
    console.error(`Error deleting quiz detail for quizNumber ${quizNumber}:`, error.message);
    throw error;
  }
};



// 复制 Quiz
export const createQuiz = async (quizData) => {
  try {
    const newQuiz = await QuizModel.create(quizData);
    return newQuiz;
  } catch (error) {
    console.error("Error creating quiz:", error.message);
    throw error;
  }
};


export const getQuizzesByCourse = async (courseId) => {
  return await QuizModel.find({ _id: courseId }).sort({ quizth: 1 });
};

export const createQuizDetails = async (details) => {
  return await DetailModel.create(details);
};


// Find attempts by quiz Number and student ID
// export const findAttemptsByQuizAndStudent = async (quizNumber, studentId) => {
//   return await AttemptModel.find({ quizNumber, studentId }).sort({ attemptNumber: -1 });
// };
export const findAttemptsByQuizAndStudent = async (quizNumber, studentId) => {
  try {
    const record = await AttemptModel.findOne({ quizNumber, studentId });
    console.log("record is",record);
    return record; // 返回嵌套的 attempts 数组
  } catch (error) {
    console.error("Error finding attempts by quiz and student:", error.message);
    throw error;
  }
};


// export const createAttempt = async (attemptData) => {
//   try {
//     const newAttempt = await AttemptModel.create(attemptData);
//     return newAttempt;
//   } catch (error) {
//     console.error("Error creating attempt:", error.message);
//     throw error;
//   }
// };
export const createAttempt = async (courseId, quizNumber, studentId, attemptData) => {
  try {
    const existingRecord = await AttemptModel.findOne({ quizNumber, studentId });

    if (existingRecord) {
      // 如果记录存在，将新的尝试添加到 `attempts` 数组
      existingRecord.attempts.push(attemptData);
      await existingRecord.save();
      return existingRecord;
    } else {
      // 如果记录不存在，创建新的文档
      const newRecord = await AttemptModel.create({
        courseId,
        quizNumber,
        studentId,
        attempts: [attemptData], // 初始化 attempts 数组
      });
      return newRecord;
    }
  } catch (error) {
    console.error("Error creating or updating attempt:", error.message);
    throw error;
  }
};



// export const calculateScore = async (quizNumber, answers) => {
//   try {
//     // 根据 quizNumber 查找 quiz 数据
//     const quiz = await findQuizByNumber(quizNumber);

//     if (!quiz) {
//       throw new Error(`Quiz with quizNumber ${quizNumber} not found`);
//     }

//     let correctAnswers = 0;

//     // 遍历学生答案并生成带有 isCorrect 的答案列表
//     const updatedAnswers = answers.map((answer) => {
//       const question = quiz.questions[answer.questionIndex]; // 根据 index 找到对应的 quiz question

//       if (!question) {
//         console.warn(`Question index ${answer.questionIndex} not found in quiz`);
//         return { ...answer, isCorrect: false }; // 题目不存在，默认错误
//       }

//       const isCorrect = question.correctAnswer === answer.selectedAnswer;

//       if (isCorrect) {
//         const points = Number.isFinite(question.points) ? question.points : 0;
//         correctAnswers += points; // 如果答案正确，加上该题分数
//       }

//       // 返回包含 isCorrect 的答案
//       return { ...answer, isCorrect };
//     });

//     return { score: correctAnswers, updatedAnswers };
//   } catch (error) {
//     console.error("Error in calculateScore:", error.message);
//     throw error; // 继续抛出错误以供上层处理
//   }
// };
export const calculateScore = async (quizNumber, answers) => {
  try {
    // 根据 quizNumber 查找 quiz 数据
    const quiz = await findQuizByNumber(quizNumber);

    if (!quiz) {
      throw new Error(`Quiz with quizNumber ${quizNumber} not found`);
    }

    let correctAnswers = 0;

    // 遍历学生答案并生成带有 isCorrect 的答案列表
    const updatedAnswers = answers.map((answer) => {
      const question = quiz.questions[answer.questionIndex]; // 根据 index 找到对应的 quiz question

      if (!question) {
        console.warn(`Question index ${answer.questionIndex} not found in quiz`);
        return { ...answer, isCorrect: false }; // 题目不存在，默认错误
      }

      // Handle different formats of correctAnswer
      let isCorrect = false;
      if (typeof question.correctAnswer === "boolean") {
        // Boolean comparison
        isCorrect = question.correctAnswer === answer.selectedAnswer;
      } else if (Array.isArray(question.correctAnswer)) {
        // Array comparison (e.g., multiple correct answers)
        isCorrect = question.correctAnswer.includes(answer.selectedAnswer);
      } else if (typeof question.correctAnswer === "number") {
        // Index-based comparison
        isCorrect = question.correctAnswer === parseInt(answer.selectedAnswer, 10);
      } else {
        // String or other types
        isCorrect = question.correctAnswer === answer.selectedAnswer;
      }

      if (isCorrect) {
        const points = Number.isFinite(question.points) ? question.points : 0;
        correctAnswers += points; // 如果答案正确，加上该题分数
      }

      // 返回包含 isCorrect 的答案
      return { ...answer, isCorrect };
    });

    return { score: correctAnswers, updatedAnswers };
  } catch (error) {
    console.error("Error in calculateScore:", error.message);
    throw error; // 继续抛出错误以供上层处理
  }
};






// export const findLastAttempt = async (quizNumber, studentId) => {
//   try {
//     const lastAttempt = await AttemptModel.findOne({ quizNumber, studentId }).sort({ attemptNumber: -1 });
//     return lastAttempt;
//   } catch (error) {
//     console.error("Error finding last attempt:", error.message);
//     throw error;
//   }
// };
export const findLastAttempt = async (quizNumber, studentId) => {
  try {
    const record = await AttemptModel.findOne({ quizNumber, studentId });
    if (record && record.attempts.length > 0) {
      // 获取 attempts 数组中最新的一次尝试
      return record.attempts[record.attempts.length - 1];
    }
    return null;
  } catch (error) {
    console.error("Error finding last attempt:", error.message);
    throw error;
  }
};


// export const updateAttempt = async (quizNumber, studentId, attemptData) => {
//   try {
//     // 查找特定的记录
//     const record = await findAttemptsByQuizAndStudent ( quizNumber, studentId );

//     if (!record) {
//       throw new Error(
//         `No existing record found for quizNumber ${quizNumber} and studentId ${studentId}`
//       );
//     }

//     // 找到需要更新的尝试记录
//     const attemptIndex = record.attempts.findIndex(
//       (attempt) => attempt.attemptNumber === attemptData.attemptNumber
//     );


//     if (attemptIndex === -1) {
//       throw new Error(
//         `Attempt with number ${attemptData.attemptNumber} not found for quizNumber ${quizNumber} and studentId ${studentId}`
//       );
//     }

//     // 更新尝试记录
//     record.attempts[attemptIndex] = {
//       ...record.attempts[attemptIndex],
//       ...attemptData, // 合并更新数据
//     };

//     // 保存更新后的记录
//     await record.save();

//     return record.attempts[attemptIndex]; // 返回更新后的尝试记录
//   } catch (error) {
//     console.error("Error updating attempt:", error.message);
//     throw error;
//   }
// };

export const updateAttempt = async (record, attemptData) => {
  try {
    console.log()
    // 找到需要更新的尝试记录
    const attemptIndex = record.attempts.findIndex(
      (attempt) => attempt.attemptNumber === attemptData.attemptNumber
    );

    console.log(attempt);
    console.log(attempt.attemptNumber);

    if (attemptIndex === -1) {
      throw new Error(
        `Attempt with number ${attemptData.attemptNumber} not found for quizNumber ${record.quizNumber} and studentId ${record.studentId}`
      );
    }

    // 更新尝试记录
    record.attempts[attemptIndex] = {
      ...record.attempts[attemptIndex],
      ...attemptData, // 合并更新数据
    };

    // 保存更新后的记录
    await record.save();

    return record.attempts[attemptIndex]; // 返回更新后的尝试记录
  } catch (error) {
    console.error("Error updating attempt:", error.message);
    throw error;
  }
};















export const deleteQuiz = async (quizId) => await QuizModel.findByIdAndDelete(quizId);

// Attempt DAO functions
export const findAttemptsByQuizNumber = async (quizNumber) =>
  await AttemptModel.find({ quizNumber });


// Detail DAO functions

export const createDetails = async (details) => await DetailModel.create(details);

export const findAttemptsByStudentAndCourse = async (studentId, courseId) => {
  try {
    const attempts = await AttemptModel.find({
      studentId,
      courseId,
    });
    return attempts;
  } catch (error) {
    console.error(
      `Error finding attempts for student ${studentId} in course ${courseId}:`,
      error.message
    );
    throw error;
  }
};



