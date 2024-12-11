import mongoose from "mongoose";
import schema from "./schema.js";

const assignmentModel = mongoose.model("AssignmentModel", schema);

export default assignmentModel;
