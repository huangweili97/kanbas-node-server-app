
import model from "./model.js";
import courseModel from "../Courses/model.js"; 


// 查找指定课程的模块
export async function findModulesForCourse(courseId) {
    try {
      // 从 courses 集合中找到对应的课程
      const course = await courseModel.findById(courseId);
      if (!course) {
        throw new Error("Course not found");
      }
  
      // 根据课程编号查找对应的模块
      const modules = await model.find({ course: course.number });
      return modules;
    } catch (error) {
      console.error("Error finding modules for course:", error);
      throw error;
    }
  }
  
  

// 根据 moduleId 查找指定模块
export async function findModuleById(moduleId) {
  try {
    // 使用模型的 `findById` 方法查找模块
    const module = await model.findById(moduleId);
    if (!module) {
      throw new Error("Module not found");
    }
    return module;
  } catch (error) {
    console.error("Error finding module by ID:", error);
    throw error;
  }
}




  


export function createModule(module) {
  delete module._id;
  return model.create(module);
}


export function deleteModule(moduleId) {
  return model.deleteOne({ _id: moduleId });
}



export function updateModule(moduleId, moduleUpdates) {
  return model.updateOne({ _id: moduleId }, moduleUpdates);
}
