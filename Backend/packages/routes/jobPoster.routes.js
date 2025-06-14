import express from "express";
import {
  createJobPosting,
  getJobPosting,
  updateJobPosting,
  getJobsWithApplicationStatsHandling,
  getAllAppliedCandidatesHandling,
  getNewlyAppliedCandidatesHandling,
  getCandidatesWithJobsApplied,
  updateJobAppliedStatus,
  getResumeLink,
  createContactUs,
  getAllContactUs,
  getRecommendedCandidates,
  updateCommonMessage,
  createIssue,
  getAllIssues,
  updateIssue,
  finishUpHelpDesk,
} from "../employer-service/src/employerController.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Protected routes that require authentication
router.post("/createJobPosting", createJobPosting);
router.get("/getJobPostings", getJobPosting);
router.put("/updateJobPosting/:jobId", updateJobPosting);
router.put(
  "/updateJobAppliedStatus/:id",
  // authenticateJWT,
  updateJobAppliedStatus
);

//EMP Dashboard API's
router.get(
  "/getJobsWithApplication",
  // authenticateJWT,
  getJobsWithApplicationStatsHandling
);

router.get(
  "/getAllAppliedCandidates",
  authenticateJWT,
  getAllAppliedCandidatesHandling
);
router.get(
  "/getNewlyAppliedCandidatesHandling",
  authenticateJWT,
  getNewlyAppliedCandidatesHandling
);
router.post(
  "/getAllCandidatesData",
  authenticateJWT,
  getCandidatesWithJobsApplied
);
router.get("/getResumeLink", authenticateJWT, getResumeLink);
router.post("/getRecommendedCandidates", getRecommendedCandidates);
router.post("/contactUs", createContactUs);
router.get("/contactUs", getAllContactUs);
router.post("/updateCommonMessage", updateCommonMessage);
router.post("/addHelpDeskIssue", createIssue);
router.get("/findAllIssues", getAllIssues);
router.post("/finishUpHelpDesk", finishUpHelpDesk);
router.put("/updateIssue/:id", updateIssue);

export default router;
