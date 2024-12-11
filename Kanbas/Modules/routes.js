import * as modulesDao from "./dao.js";
import mongoose from "mongoose";
export default function ModuleRoutes(app) {

  // 删除指定模块
app.delete("/api/modules/:moduleId", async (req, res) => {
  const { moduleId } = req.params;
  const status = await modulesDao.deleteModule(moduleId);
  res.send(status);
});


// 更新指定模块
app.put("/api/modules/:moduleId", async (req, res) => {
  const { moduleId } = req.params;
  const moduleUpdates = req.body;
  const status = await modulesDao.updateModule(moduleId, moduleUpdates);
  res.send(status);
});

app.post("/api/modules/:moduleId/lessons", async (req, res) => {
  try {
    const { moduleId } = req.params;
    const lesson = req.body;

    if (!moduleId) {
      return res.status(400).send('Module ID is required');
    }
  

    const module = await modulesDao.findModuleById(moduleId);
    if (!module) return res.status(404).send({ message: "Module not found" });

    module.lessons.push(lesson);
    await module.save();

    res.status(201).send(module);
  } catch (error) {
    console.error("Error adding lesson:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});




}
