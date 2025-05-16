import express from "express";
import {
  getAllMessages,
  getAuth,
  getChatHistory,
  getUnreadMessages,
  sendMessage,
} from "../message-service/src/message.controller.js";

const router = express.Router();

router.post("/sendMessage", sendMessage);

router.get("/getUnreadMessages", getUnreadMessages);
router.get("/getAllMessages", getAllMessages);
router.get("/getChatHistory", getChatHistory);

router.get("/getAuth", getAuth);

export default router;
