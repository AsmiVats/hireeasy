import express from "express";
import {
  addDummyData,
  createEducation,
  createEmployment,
  createJobApplicationHandling,
  createJobSeekerProfile,
  createLanguage,
  createSkill,
  deleteEducation,
  deleteEmployment,
  deleteLanguage,
  deleteSkill,
  getJobSeekerProfiles,
  searchJobs,
  updateEducation,
  updateEmployment,
  updateJobApplicationHandling,
  updateJobSeekerProfile,
  updateLanguage,
  updatePassword,
  updateSkills,
} from "../jobseeker-service/src/jobseekerController.js";

const router = express.Router();

router.post("/createJobSeekerProfile", createJobSeekerProfile);
router.get("/getJobSeekerProfile", getJobSeekerProfiles);
router.put("/updateJobSeekerProfile/:id", updateJobSeekerProfile);
router.post("/createEducation", createEducation);

router.post("/jobApply", createJobApplicationHandling);
router.put("/updateJobApplied/:id", updateJobApplicationHandling);
router.post("/createEmployment", createEmployment);
router.delete("/employment",deleteEmployment);
router.post("/addSkills", createSkill);
router.delete("/skill",deleteSkill);
router.post("/addLanguage", createLanguage);
router.delete("/language",deleteLanguage)
router.post("/searchJobs", searchJobs);
router.post("/addDummyData", addDummyData);
router.put("/updateSkills/:id", updateSkills);
router.put("/updateEducation/:id", updateEducation);
router.delete("/education",deleteEducation);
router.put("/updateLanguage/:id", updateLanguage);
router.put("/updateEmployment/:id", updateEmployment);
router.post("/updatePassword", updatePassword);

export default router;
