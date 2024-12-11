import mongoose from "mongoose";


// const questionSchema = new mongoose.Schema({
//   questionNumber: String,
//   type: String,
//   title: String,
//   points: Number,
//   choices: [String],
//   correctAnswer: mongoose.Schema.Types.Mixed,
// });
const questionSchema = new mongoose.Schema({
  questionNumber: String,
  type: String,
  title: String,
  points: Number,
  choices: [String],
  correctAnswer: mongoose.Schema.Types.Mixed, // 支持多种类型
});



const attemptSchema = new mongoose.Schema({
  courseId:{type: mongoose.Schema.Types.ObjectId, ref: "CourseModel"},
  quizNumber: { type: String, required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel" },
  attempts: [
    {
      attemptNumber: { type: Number},
      attemptDate: { type: Date, required: true },
      score: { type: Number, required: true},
      answers: [
        {
          
          selectedAnswer: mongoose.Schema.Types.Mixed,
          isCorrect: { type: Boolean, required: true },
        },
      ],
    },
  ],
});


// 定义 quizSchema，并显式指定集合名为 "quizs"
const quizSchema = new mongoose.Schema(
  {
    quizNumber: { type: String, required: true, unique: true },
    module: { type: String},
    course: { type: String, required: true },
    title: { type: String},
    totalPoints: { type: Number, default: 0 },
    questions: { type: [questionSchema], default: [] },
    availableDate: { type: Date },
    availableUntil: { type: Date},
    dueDate: { type: Date},
    isPublished: { type: Boolean, default: false },
    quizth: {type: Number},

  },
  { collection: "quizs" } // 显式指定集合名称为 "quizs"
);

const detailSchema = new mongoose.Schema(
  {
    quizNumber: { type: String, required: true, unique: true },
    quizType: { type: String, default: "Graded Quiz" },
    points: Number,
    assignmentGroup: { type: String, default: "Quizzes" },
    shuffleAnswers: { type: Boolean, default: true },
    timeLimit: { type: Number, default: 20 },
    multipleAttempts: { type: Boolean, default: false },
    howManyAttempts: { type: Number, default: 1 },
    showCorrectAnswers: { type: Boolean, default: true },
    accessCode: { type: String, default: "" },
    oneQuestionAtATime: { type: Boolean, default: true },
    webcamRequired: { type: Boolean, default: false },
    lockQuestionsAfterAnswering: { type: Boolean, default: false },
    dueDate: Date,
    availableDate: Date,
    untilDate: Date,
    assignTo: { type: String, default: "Everyone" },
    instruction: String,
    title: String,
  },
  { collection: "details" }

);

detailSchema.pre("save", async function (next) {
  const quiz = await mongoose.model("Quiz").findOne({ quizNumber: this.quizNumber });
  if (quiz) {
    this.points = quiz.totalPoints; // 同步 points 字段
  }
  next();
});

detailSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (update.quizNumber) {
    const quiz = await mongoose.model("Quiz").findOne({ quizNumber: update.quizNumber });
    if (quiz) {
      update.points = quiz.totalPoints; // 同步 points 字段
    }
  }
  next();
});


export { quizSchema, attemptSchema, detailSchema };
