


import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";


// UserRoutes 是一个默认导出的函数，用于配置应用（app）的用户相关路由。
export default function UserRoutes(app) {

  // 找到所有的用户
  const findAllUsers = async (req, res) => {
    const { role, name } = req.query;
    if (role) {
      const users = await dao.findUsersByRole(role);
      res.json(users);
      return;
    }
    if (name) {
      const users = await dao.findUsersByPartialName(name);
      res.json(users);
      return;
    }

    const users = await dao.findAllUsers();
    res.json(users);
  };

  // 创建用户
  const createUser = async (req, res) => {
    const user = await dao.createUser(req.body);
    res.json(user);
  };

  // 删除用户
  const deleteUser = async (req, res) => {
    const status = await dao.deleteUser(req.params.userId);
    res.json(status);
  };


  // 通过id寻找用户
  const findUserById = async (req, res) => {
    const user = await dao.findUserById(req.params.userId);
    res.json(user);
  };

  // 更新用户
  const updateUser = async (req, res) => {
    const { userId } = req.params;
    const userUpdates = req.body;

    const result = await dao.updateUser(userId, userUpdates);
    const updatedUser = await dao.findUserById(userId); // 获取最新数据
    if (
      req.session["currentUser"] &&
      req.session["currentUser"]._id === userId
    ) {
      req.session["currentUser"] = updatedUser; // 更新 session
    }
    res.json(updatedUser); // 返回更新后的用户数据
  };


  // 登陆
  const signin = async (req, res) => {
    const { username, password } = req.body;
    const currentUser = await dao.findUserByCredentials(username, password);
    if (currentUser) {
      req.session["currentUser"] = currentUser;
      res.json(currentUser);
    } else {
      res.status(401).json({ message: "Unable to login. Try again later." });
    }
  };


  // 注册
  const signup = async (req, res) => {
    const user = await dao.findUserByUsername(req.body.username);
    if (user) {
      res.status(400).json({ message: "Username already taken" });
      return;
    }
    const currentUser = await dao.createUser(req.body);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };

  // 登出
  const signout = (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
  };


  // profile
  const profile = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    res.json(currentUser);
  };

  // app.get("/api/users/current", (req, res) => {
  //   const currentUser = req.session["currentUser"];
  //   if (currentUser) {
  //     res.json(currentUser);
  //   } else {
  //     res.sendStatus(401);
  //   }
  // });

  // enroll
  const enrollUserInCourse = async (req, res) => {
    let { uid, cid } = req.params;
    if (uid === "current") {
      const currentUser = req.session["currentUser"];
      uid = currentUser._id;
    }
    const status = await enrollmentsDao.enrollUserInCourse(uid, cid);
    res.send(status);
  };

  // unenroll
  const unenrollUserFromCourse = async (req, res) => {
    let { uid, cid } = req.params;
    if (uid === "current") {
      const currentUser = req.session["currentUser"];
      uid = currentUser._id;
    }
    try {
      const result = await enrollmentsDao.unenrollUserFromCourse(uid, cid);
      if (result.acknowledged && result.deletedCount > 0) {
        res.sendStatus(200); // 正确返回 HTTP 状态码 200 表示成功
      } else {
        res.status(404).send({ error: "Enrollment not found" }); // 返回 404 表示资源未找到
      }
    } catch (error) {
      console.error("Error unenrolling user:", error);
      res.status(500).send({ error: "Internal Server Error" }); // 返回 500 表示服务器错误
    }
  };
  

  
  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);
  app.post("/api/users/:uid/courses/:cid", enrollUserInCourse);
  app.delete("/api/users/:uid/courses/:cid", unenrollUserFromCourse);
}
