import express from "express";
import {
  createDemoHandling,
  getAllDemos,
} from "../employer-service/src/employerController.js";

const router = express.Router();

router.post("/bookDemo", createDemoHandling);
router.get("/getDemos", getAllDemos);
export default router;
