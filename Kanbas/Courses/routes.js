



import * as dao from "./dao.js";
import * as modulesDao from "../Modules/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";
import mongoose from "mongoose";




export default function CourseRoutes(app) {

  /**
   * 所有课程层面的
   */
  // 返回所有课程
  app.get("/api/courses", async (req, res) => {
    const courses = await dao.findAllCourses();
    res.send(courses);
  });



  /**
   * 单课程层面的
   */

  // 创建新课程
  app.post("/api/courses", async (req, res) => {
    const course = await dao.createCourse(req.body);
    const currentUser = req.session["currentUser"];
    if (currentUser) {
      await enrollmentsDao.enrollUserInCourse(currentUser._id, course._id);
    }
    res.json(course);
  });
 

  // 删除指定课程
  app.delete("/api/courses/:courseId", async (req, res) => {
    const { courseId } = req.params;
    const status = await dao.deleteCourse(courseId);
    res.send(status);
  });

  // 更新指定课程
  app.put("/api/courses/:courseId", async (req, res) => {
    const { courseId } = req.params;
    const courseUpdates = req.body;
    const status = await dao.updateCourse(courseId, courseUpdates);
    res.send(status);
  });

  // 返回指定课程的详细信息
  app.get("/api/courses/:courseId", async (req, res) => {
    const { courseId } = req.params;
    const course = await dao.findCourseById(courseId);
    if (course) {
      res.send(course);
    } else {
      res.status(404).send({ error: "Course not found" });
    }
  });


  /**
   * 模块层面的
   */

  // // 返回指定课程的模块
  // app.get("/api/courses/:courseId/modules", async (req, res) => {
  //   const { courseId } = req.params;
  //   const modules = await modulesDao.findModulesForCourse(courseId);
  //   res.json(modules);
  // });

  // // 为指定课程创建模块
  // app.post("/api/courses/:courseId/modules", async (req, res) => {
  //   const { courseId } = req.params;
  //   const module = {
  //     ...req.body,
  //     course: courseId,
  //   };
  //   const newModule = await modulesDao.createModule(module);
  //   res.send(newModule);
  // });



  app.get("/api/courses/:courseId/modules", async (req, res) => {
    const { courseId } = req.params;
  
    try {
      // 验证 courseId 的有效性
      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        res.status(400).json({ error: "Invalid courseId" });
        return;
      }
  
      // 根据 courseId 找到课程
      const course = await dao.findCourseById(courseId);
      if (!course) {
        res.status(404).json({ error: "Course not found" });
        return;
      }
  
      // 调用模块 DAO 方法查找关联模块
      const modules = await modulesDao.findModulesForCourse(courseId);
  
      if (!modules || modules.length === 0) {
        res.status(404).json({ error: "No modules found for this course" });
        return;
      }
  
      res.json(modules);
    } catch (error) {
      console.error("Failed to fetch modules:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  

  app.post("/api/courses/:courseId/modules", async (req, res) => {
    const { courseId } = req.params;
  
    try {
      // 验证 courseId 的有效性
      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        res.status(400).json({ error: "Invalid courseId" });
        return;
      }
  
      // 根据 courseId 查找课程
      const course = await dao.findCourseById(courseId);
      if (!course) {
        res.status(404).json({ error: "Course not found" });
        return;
      }
  
      // 创建模块并关联课程
      const moduleData = {
        ...req.body,
        course: course.number, // 使用 courseId 作为关联字段
      };
  
      const newModule = await modulesDao.createModule(moduleData);
      res.status(201).json(newModule);
    } catch (error) {
      console.error("Failed to create module:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  



  /**
   * 
   * 课程绑定的用户层面的
   */

  // 返回注册到课程的所有用户
  const findUsersForCourse = async (req, res) => {
    const { cid } = req.params;
    const users = await enrollmentsDao.findUsersForCourse(cid);
    res.json(users);
  };
  app.get("/api/courses/:cid/users", findUsersForCourse);

}

