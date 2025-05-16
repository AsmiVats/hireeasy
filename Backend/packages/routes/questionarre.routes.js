import express from "express";
import {
  createMCQ,
  updateMCQ,
  getMCQs,
  updateSkillName,
} from "../questionarre-service/src/questionarre.controller.js";

const router = express.Router();

router.post("/addMCQ", createMCQ);
router.get("/getMCQ", getMCQs);
router.post("/updateMCQ", updateMCQ);
router.post("/updateSkillId", updateSkillName);

export default router;
