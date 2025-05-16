import express from "express";
import {
  signup,
  login,
  jwtVerify,
  getUsers,
  updateUser,
  deleteUser,
  sendOtp,
  verifyOtp,
  getCurrentUser
} from "../auth-service/src/auth.controller.js";
import { getPaymentIntent } from "../../utils/stripePayment.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", signup);
router.put("/updateUser/:id", updateUser);
router.post("/login", login);
router.post("/tokenVerify", jwtVerify);
router.get("/getUsers", authenticateJWT, getUsers);
router.get("/me", authenticateJWT, getCurrentUser);
router.post("/sendOtp", sendOtp);
router.post("/verifyOtp", verifyOtp);
router.post("/getPaymentIntent", getPaymentIntent);
router.delete("/deleteUser", deleteUser);

export default router;
