import mongoose, { mongo } from "mongoose";
import {
  CommonMessage,
  Job,
} from "../../employer-service/src/employerController.js";
import bcrypt from "bcryptjs";
import { pushMessageOrActivity } from "../../message-service/src/message.controller.js";
import { User } from "../../auth-service/src/auth.controller.js";

const EmploymentSchema = new mongoose.Schema({
  candidateProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CandidateProfile",
  },
  jobTitle: { type: String },
  companyName: { type: String },
  description: { type: String },
  fromDate: { type: Date },
  toDate: { type: Date },
  totalYearsSpent: { type: Number },
  status: { type: String, default: "ACTIVE" },
});

const JobAppliedSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CandidateProfile",
  },
  appliedAt: { type: Date, default: Date.now },
  status: { type: String, default: "ACTIVE" },
  applicationStatus: { type: String, default: "ACTIVE" },
});

const otpSchema = new mongoose.Schema({
  otp: {
    type: Number,
  },
  email: {
    type: String,
  },
});

export const Otp = mongoose.model("otp", otpSchema);

export const JobApplied = mongoose.model("JobsApplied", JobAppliedSchema);

const Employment = mongoose.model("Employment", EmploymentSchema);

const EducationSchema = new mongoose.Schema({
  candidateProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CandidateProfile",
  },
  status: { type: String, default: "ACTIVE" },
  degreeName: { type: String },
  universityName: { type: String },
  courseName: { type: String },
  specialization: { type: String },
  fromDate: { type: Date },
  toDate: { type: Date },
});

const Education = mongoose.model("Education", EducationSchema);

const SkillSchema = new mongoose.Schema({
  candidateProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CandidateProfile",
  },
  status: { type: String, default: "ACTIVE" },
  name: { type: String },
  rating: { type: Number, min: 0, max: 10 },
});

const Skill = mongoose.model("Skill", SkillSchema);

const LanguageSchema = new mongoose.Schema({
  candidateProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CandidateProfile",
  },
  status: { type: String, default: "ACTIVE" },
  name: { type: String },
  rating: { type: Number, min: 1, max: 10 },
  read: { type: Boolean, default: false },
  write: { type: Boolean, default: false },
  speak: { type: Boolean, default: false },
});

const Language = mongoose.model("Language", LanguageSchema);

const candidateSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: {
      type: String,

      unique: true,
      sparse: true,
      validate: {
        validator: function (v) {
          return /^\S+@\S+\.\S+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    password: { type: String },
    phone: { type: String },
    dob:{type:Date},
    city: { type: String },
    state: { type: String },
    address: {type:String},
    country: { type: String },
    postalCode: { type: String },
    experience: { type: String, default: "" },
    skills: [{ type: String }],
    achievements: [{ type: String }],
    linkedinProfile: {type:String},
    videoLink:{type:String},
    payScale: {type: String},
    payType: {type: String},
    noticePeriod: {type: String},
    resumeLink: { type: String },
    profileHeadline: { type: String },
    lastActive: { type: Date },

    // Fields for JobDiva integration
    externalId: {
      type: String,
      description: "ID from external system (e.g. JobDiva)",
    },
    externalSource: {
      type: String,
      description: "Source of external ID (e.g. 'JobDiva')",
    },
  },
  { timestamps: true }
);

candidateSchema.index({ name: "text" });

export const CandidateProfile = mongoose.model(
  "CandidateProfile",
  candidateSchema
);
CandidateProfile.createIndexes();

// Controllers
export const createJobSeekerProfile = async (req, res) => {
  try {
    // const findCondition = {};
    let data = req.body;

    console.log(data);
    
    const existingProfile = await CandidateProfile.find({email:data.email});
    let obj;
    let candidateProfile;
    if (existingProfile?.length > 0) {
       candidateProfile = existingProfile[0];
      if (data.name) candidateProfile.name = data.name;
      if (data.phone) candidateProfile.phone = data.phone;
      if (data.dob) candidateProfile.dob = data.dob;
      if (data.city) candidateProfile.city = data.city;
      if (data.state) candidateProfile.state = data.state;
      if (data.country) candidateProfile.country = data.country;
      if (data.zipcode) candidateProfile.postalCode = data.zipcode;
      if (data.experience !== undefined) candidateProfile.experience = data.experience;
      if (data.profileHeadline) candidateProfile.profileHeadline = data.profileHeadline;
      if (data.resumeLink) candidateProfile.resumeLink = data.resumeLink;
      if(data.address) candidateProfile.address = data.address;
      
      if (Array.isArray(data.skills)) candidateProfile.skills = data.skills;
      if (Array.isArray(data.achievements)) candidateProfile.achievements = data.achievements;

      if (data.linkedinProfile) {
        candidateProfile.linkedinProfile = data.linkedinProfile;
      }

      if(data.videoLink){
        candidateProfile.videoLink = data.videoLink;
      }
      
      if (data.payScale) {
        candidateProfile.payScale = data.payScale;
      }
      if (data.payType) {
        candidateProfile.payType = data.payType;
      }

      if(data.noticePeriod){
        console.log("Hi")
        candidateProfile.noticePeriod = data.noticePeriod;
      }
      
      candidateProfile.lastActive = new Date();
      await candidateProfile.save();
      console.log(candidateProfile)
      obj = {
        ...data,
      }
    }else{
      if (data?.password) {
        data.password = await bcrypt.hash(data?.password, 10);
      }
  
      obj = {
        ...data,
      };
  
      candidateProfile = new CandidateProfile(obj);
      await candidateProfile.save();
    }

    

    // Sync with JobDiva if real-time sync is enabled
    // const ENABLE_JOBDIVA_REALTIME_SYNC =
    //   process.env.ENABLE_JOBDIVA_REALTIME_SYNC === "true";
    const ENABLE_JOBDIVA_REALTIME_SYNC = true;

    if (ENABLE_JOBDIVA_REALTIME_SYNC) {
      try {
        // Import authentication service to check if JobDiva integration is enabled
        const authService = await import(
          "../../../utils/jobdiva/jobdivaAuth.js"
        );

        // Only proceed if JobDiva integration is enabled
        if (authService.default.isJobDivaEnabled()) {
          // Import the JobDiva sync service
          const candidateSync = await import(
            "../../jobdiva-service/src/candidateSync.js"
          );

          // Push the candidate to JobDiva
          const jobDivaResult =
            await candidateSync.default.pushCandidateToJobDiva(obj);

          if (jobDivaResult.success) {
            // Store the JobDiva ID in the candidate document for future reference
            candidateProfile.externalId = jobDivaResult.jobDivaId;
            candidateProfile.externalSource = "JobDiva";
            await candidateProfile.save();

            console.log(
              `Candidate successfully synced to JobDiva with ID: ${jobDivaResult.jobDivaId}`
            );
          } else {
            console.error(
              `Failed to sync candidate to JobDiva: ${jobDivaResult.error}`
            );
          }
        }
      } catch (syncError) {
        console.error("Error syncing candidate to JobDiva:", syncError);
        // We don't want to fail the candidate creation if the sync fails
        // Just log the error and continue
      }
    }

    res.status(201).json(candidateProfile);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error creating Candidate Profile",
      error: error.message,
    });
  }
};

export const updateJobSeekerProfile = async (req, res) => {
  try {
    let data = req.body;

    if (data?.password) {
      let password = await bcrypt.hash(data?.password, 10);
      delete data["password"];
      data["password"] = password;
    }

    const updatedProfile = await CandidateProfile.findByIdAndUpdate(
      req.params.id,
      data,
      {
        new: true,
      }
    );

    if (!updatedProfile)
      return res.status(404).json({
        message: "Candidate Profile not found",
      });

    // Sync with JobDiva if real-time sync is enabled
    // const ENABLE_JOBDIVA_REALTIME_SYNC =
    //   process.env.ENABLE_JOBDIVA_REALTIME_SYNC === "true";
    const ENABLE_JOBDIVA_REALTIME_SYNC = true;

    if (ENABLE_JOBDIVA_REALTIME_SYNC) {
      try {
        // Import authentication service to check if JobDiva integration is enabled
        const authService = await import(
          "../../../utils/jobdiva/jobdivaAuth.js"
        );

        // Only proceed if JobDiva integration is enabled
        if (authService.default.isJobDivaEnabled()) {
          // If the candidate has an externalId from JobDiva, update it in JobDiva
          if (
            updatedProfile.externalId &&
            updatedProfile.externalSource === "JobDiva"
          ) {
            // Import the JobDiva sync service
            const candidateSync = await import(
              "../../jobdiva-service/src/candidateSync.js"
            );

            // Update the candidate in JobDiva
            const jobDivaResult =
              await candidateSync.default.updateCandidateInJobDiva(
                updatedProfile.externalId,
                updatedProfile
              );

            if (jobDivaResult.success) {
              console.log(
                `Candidate successfully updated in JobDiva with ID: ${updatedProfile.externalId}`
              );

              // If there's a resume link update and it's different from before, try to upload it to JobDiva as well
              if (
                data.resumeLink &&
                data.resumeLink !== updatedProfile._doc.resumeLink
              ) {
                try {
                  const axios = await import("axios");

                  // Fetch the resume file
                  const response = await axios.default.get(data.resumeLink, {
                    responseType: "arraybuffer",
                  });
                  const resumeBuffer = Buffer.from(response.data);

                  // Extract filename from the URL
                  const urlParts = data.resumeLink.split("/");
                  const fileName =
                    urlParts[urlParts.length - 1] || "resume.pdf";

                  // Upload the resume to JobDiva
                  const resumeResult =
                    await candidateSync.default.uploadCandidateResume(
                      updatedProfile.externalId,
                      resumeBuffer,
                      fileName
                    );

                  if (resumeResult.success) {
                    console.log(
                      `Resume successfully uploaded to JobDiva with document ID: ${resumeResult.documentId}`
                    );
                  } else {
                    console.error(
                      `Failed to upload resume to JobDiva: ${resumeResult.error}`
                    );
                  }
                } catch (resumeError) {
                  console.error(
                    "Error uploading resume to JobDiva:",
                    resumeError
                  );
                }
              }
            } else {
              console.error(
                `Failed to update candidate in JobDiva: ${jobDivaResult.error}`
              );
            }
          } else {
            // If the candidate doesn't have an externalId, it means it hasn't been synced yet
            // Let's try to sync it now
            // Import the JobDiva sync service
            const candidateSync = await import(
              "../../jobdiva-service/src/candidateSync.js"
            );

            // Push the candidate to JobDiva
            const jobDivaResult =
              await candidateSync.default.pushCandidateToJobDiva(
                updatedProfile
              );

            if (jobDivaResult.success) {
              // Store the JobDiva ID in the candidate document for future reference
              updatedProfile.externalId = jobDivaResult.jobDivaId;
              updatedProfile.externalSource = "JobDiva";
              await updatedProfile.save();

              console.log(
                `Candidate successfully synced to JobDiva with ID: ${jobDivaResult.jobDivaId}`
              );

              // If there's a resume link, try to upload it to JobDiva as well
              if (updatedProfile.resumeLink) {
                try {
                  const axios = await import("axios");

                  // Fetch the resume file
                  const response = await axios.default.get(
                    updatedProfile.resumeLink,
                    { responseType: "arraybuffer" }
                  );
                  const resumeBuffer = Buffer.from(response.data);

                  // Extract filename from the URL
                  const urlParts = updatedProfile.resumeLink.split("/");
                  const fileName =
                    urlParts[urlParts.length - 1] || "resume.pdf";

                  // Upload the resume to JobDiva
                  const resumeResult =
                    await candidateSync.default.uploadCandidateResume(
                      jobDivaResult.jobDivaId,
                      resumeBuffer,
                      fileName
                    );

                  if (resumeResult.success) {
                    console.log(
                      `Resume successfully uploaded to JobDiva with document ID: ${resumeResult.documentId}`
                    );
                  } else {
                    console.error(
                      `Failed to upload resume to JobDiva: ${resumeResult.error}`
                    );
                  }
                } catch (resumeError) {
                  console.error(
                    "Error uploading resume to JobDiva:",
                    resumeError
                  );
                }
              }
            } else {
              console.error(
                `Failed to sync candidate to JobDiva: ${jobDivaResult.error}`
              );
            }
          }
        }
      } catch (syncError) {
        console.error("Error syncing candidate to JobDiva:", syncError);
        // We don't want to fail the candidate update if the sync fails
        // Just log the error and continue
      }
    }

    res.status(200).json(updatedProfile);
  } catch (error) {
    res.status(500).json({
      message: "Error updating Candidate profile",
      error: error.message,
    });
  }
};
export const deleteEmployment = async (req,res)=>{
  try{
    const id = req.query.id;
    const deletdEmployment = await Employment.findByIdAndDelete(id);
    if(deletdEmployment){
      res.status(200).json(deletdEmployment);
    }
  }catch(error){
    res.status(500).json({
      message: "Error deleting employment",
      error: error.message,
    });
  }
}
export const deleteEducation= async (req,res)=>{
  try{
    const id = req.query.id;
    const deletdEducation = await Education.findByIdAndDelete(id);
    if(deletdEducation){
      res.status(200).json(deletdEducation);
    }
  }catch(error){
    res.status(500).json({
      message: "Error deleting employment",
      error: error.message,
    });
  }
}

export const deleteSkill= async (req,res)=>{
  try{
    const id = req.query.id;
    const deletedSkill = await Skill.findByIdAndDelete(id);
    if(deletedSkill){
      res.status(200).json(deletedSkill);
    }
  }catch(error){
    res.status(500).json({
      message: "Error deleting skill",
      error: error.message,
    });
  }
}
export const deleteLanguage= async (req,res)=>{
  try{
    const id = req.query.id;
    const deletedLanguage = await Language.findByIdAndDelete(id);
    if(deletedLanguage){
      res.status(200).json(deletedLanguage);
    }
  }catch(error){
    res.status(500).json({
      message: "Error deleting language",
      error: error.message,
    });
  }
}
export const createEmployment = async (req, res) => {
  try {
    const { data } = req.body;
    const finalData = [];
    for (let i of data) {
      const employment = new Employment(i);

      await employment.save();
      finalData.push(employment);
    }
    res.status(201).json(finalData);
  } catch (error) {
    res.status(500).json({
      message: "Error creating employment",
      error: error.message,
    });
  }
};

export const createEducation = async (req, res) => {
  try {
    const { data } = req.body;
    const finalData = [];
    for (let i of data) {
      const education = new Education(i);
      await education.save();
      finalData.push(education);
    }
    res.status(200).json(finalData);
  } catch (error) {
    res.status(500).json({
      message: "Error creating education",
      error: error.message,
    });
  }
};

export const createSkill = async (req, res) => {
  try {
    const { data } = req.body;
    const finalData = [];
    for (let i of data) {
      const skill = new Skill(i);
      await skill.save();
      finalData.push(skill);
    }
    res.status(200).json(finalData);
  } catch (error) {
    res.status(500).json({
      message: "Error creating skill",
      error: error.message,
    });
  }
};

export const createLanguage = async (req, res) => {
  try {
    const { data } = req.body;
    const finalData = [];
    for (let i of data) {
      const language = new Language(i);
      await language.save();
      finalData.push(language);
    }
    res.status(200).json(finalData);
  } catch (error) {
    res.status(500).json({
      message: "Error creating language",
      error: error.message,
    });
  }
};

export const getJobSeekerProfiles = async (req, res) => {
  try {
    const id = req.query.id;
    const obj = {};
    if (id) obj._id = new mongoose.Types.ObjectId(id);

    const profiles = await CandidateProfile.aggregate([
      {
        $lookup: {
          from: "employments",
          localField: "_id",
          foreignField: "candidateProfile",
          as: "employmentDetails",
        },
      },
      {
        $lookup: {
          from: "educations",
          localField: "_id",
          foreignField: "candidateProfile",
          as: "educationDetails",
        },
      },
      {
        $lookup: {
          from: "skills",
          localField: "_id",
          foreignField: "candidateProfile",
          as: "skills",
        },
      },
      {
        $lookup: {
          from: "languages",
          localField: "_id",
          foreignField: "candidateProfile",
          as: "languages",
        },
      },
      {
        $match: obj,
      },
    ]);
    console.log(profiles[0])
    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching profiles",
      error: error.message,
    });
  }
};

export const createJobApplicationHandling = async (req, res) => {
  try {
    const {
      name,
      jobName,
      experience,
      minPay,
      maxPay,
      employerId,
      jobId,
      candidateId,
    } = req.body;

    if (!jobId || !candidateId) {
      return res
        .status(400)
        .json({ message: "Job ID and Candidate ID are required" });
    }

    const newApplication = new JobApplied({
      jobId,
      candidateId,
    });

    await newApplication.save();

    const utcDate = new Date();
    const istDate = new Date(utcDate.getTime() + 5.5 * 60 * 60 * 1000);

    const newCommonMsg = new CommonMessage({
      jobApplicationId: newApplication?.id,
      forWhom: "EMPLOYER",
      isViewed: false,
      createdAt: istDate,
    });

    await newCommonMsg.save();

    const publishObj = {
      name,
      jobName,
      experience,
      minPay,
      maxPay,
    };

    await pushMessageOrActivity(employerId, publishObj);

    return res.status(201).json({
      message: "Job application submitted successfully",
      data: newApplication,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const updateJobApplicationHandling = async (req, res) => {
  try {
    const { applicationId } = req.params;

    if (!applicationId) {
      return res.status(400).json({ message: "Application ID is required" });
    }

    const updatedApplication = await JobApplied.findOneAndUpdate(
      { _id: applicationId },
      { $set: req.body },
      { new: true }
    );

    if (!updatedApplication) {
      return res.status(404).json({ message: "Job application not found" });
    }

    return res.status(200).json({
      message: "Job application updated successfully",
      data: updatedApplication,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const updateSkills = async (req, res) => {
  try {
    let { id } = req.params;
    id = new mongoose.Types.ObjectId(id);
    console.log(req.body.data)
    const skill = await Skill.findOneAndUpdate({ _id: id }, { $set: req.body },{new:true});
    console.log(skill)
    return res.status(200).json({ success: true, message: "Update Success" });
  } catch (err) {
    console.log(err);
    return res
      .status(501)
      .json({ success: false, message: "Something went wrong" });
  }
};

//Update API's
export const updateEducation = async (req, res) => {
  try {
    let { id } = req.params;
    console.log(req.body.data)
    id = new mongoose.Types.ObjectId(id);
    const education = await Education.findOneAndUpdate({ _id: id }, { $set: req.body.data });
    return res.status(200).json({ success: true, message: "Update Success" });
  } catch (err) {
    console.log(err);
    return res
      .status(501)
      .json({ success: false, message: "Something went wrong" });
  }
};

export const updateLanguage = async (req, res) => {
  try {
    let { id } = req.params;
    id = new mongoose.Types.ObjectId(id);
    await Language.findOneAndUpdate({ _id: id }, { $set: req.body.data });
    return res.status(200).json({ success: true, message: "Update Success" });
  } catch (err) {
    console.log(err);
    return res
      .status(501)
      .json({ success: false, message: "Something went wrong" });
  }
};

export const updateEmployment = async (req, res) => {
  try {
    let { id } = req.params;
    console.log(req.body)
    id = new mongoose.Types.ObjectId(id);
    
    const employment = await Employment.findOneAndUpdate({ _id: id }, { $set: req.body.data });
    console.log(employment);
    return res.status(200).json({ success: true, message: "Update Success" });
  } catch (err) {
    console.log(err);
    return res
      .status(501)
      .json({ success: false, message: "Something went wrong" });
  }
};

export const searchJobs = async (req, res) => {
  try {
    const {
      title,
      jobType,
      jobLocationType,
      minExperience,
      maxExperience,
      minPay,
      maxPay,
      city,
      state,
      postalCode,
      country,
      candidateId,
      address,
      skills,
      page = 1,
      limit = 4,
      postedWithin,
      searchQuery,
    } = req.body;

    const filtersForJobDiva = {
      title,
      minPay,
      searchQuery:skills.join(','),
      maxPay,
      city: city || address,
      state: state || address,
      postalCode: postalCode || address,
      country: country || address,
      isRemote: jobLocationType === "Fully Remote" ? true : false,
    };

    console.log(minPay,maxPay);

    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const skip = (pageNumber - 1) * pageSize;

    const matchStage = {
      $match: {
        status: "Open",
      },
    };
    // ✅ Basic Filters (same logic)
    if (title) matchStage.$match.title = { $regex: title, $options: "i" };
    if (jobType) matchStage.$match.jobType = { $regex: jobType, $options: "i" };
    if (jobLocationType)
      matchStage.$match.jobLocationType = {
        $regex: jobLocationType,
        $options: "i",
      };
      if ((minExperience && parseInt(minExperience) > 0) || (maxExperience && parseInt(maxExperience) > 0)) {
        const range = {};
        if (minExperience && parseInt(minExperience) > 0) range.$gte = parseInt(minExperience, 10);
        if (maxExperience && parseInt(maxExperience) > 0) range.$lte = parseInt(maxExperience, 10);
        if (Object.keys(range).length > 0) {
          matchStage.$match.experience = range;
        }
      }
    if(address) {
      matchStage.$match["$or"] = [
        { "location.city": { $regex: address, $options: "i" } },
        { "location.state": { $regex: address, $options: "i" } },
        { "location.postalCode": { $regex: address, $options: "i" } },
        { "location.country": { $regex: address, $options: "i" } }
      ];
    }
    

    if ((minPay && parseInt(minPay) > 0) || (maxPay && parseInt(maxPay) > 0)) {
      matchStage.$match.$expr = { $and: [] };
      if (minPay && parseInt(minPay) > 0) {
        matchStage.$match.$expr.$and.push({
          $gte: ["$payRange.min", parseInt(minPay, 10)],
        });
      }
      if (maxPay && parseInt(maxPay) > 0) {
        matchStage.$match.$expr.$and.push({
          $lte: ["$payRange.max", parseInt(maxPay, 10)],
        });
      }
      // Remove empty $expr if no pay filters were added
      if (matchStage.$match.$expr.$and.length === 0) {
        delete matchStage.$match.$expr;
      }
    }

    if (city)
      matchStage.$match["location.city"] = { $regex: city, $options: "i" };
    if (state)
      matchStage.$match["location.state"] = { $regex: state, $options: "i" };
    if (postalCode)
      matchStage.$match["location.postalCode"] = {
        $regex: postalCode,
        $options: "i",
      };
    if (country)
      matchStage.$match["location.country"] = {
        $regex: country,
        $options: "i",
      };

    // 🔍 Search query filter
    if (searchQuery && address.trim() === "") {
      const experienceValue = parseInt(searchQuery, 10);
      matchStage.$match.$or = [
        { title: { $regex: searchQuery, $options: "i" } },
        { jobType: { $regex: searchQuery, $options: "i" } },
        { jobLocationType: { $regex: searchQuery, $options: "i" } },
        { "location.city": { $regex: searchQuery, $options: "i" } },
        { "location.state": { $regex: searchQuery, $options: "i" } },
        { "location.country": { $regex: searchQuery, $options: "i" } },
        { "location.postalCode": { $regex: searchQuery, $options: "i" } },
        { skills: { $regex: searchQuery, $options: "i" } },
        ...(isNaN(experienceValue)
          ? []
          : [{ experience: { $gte: experienceValue } }]),
      ];
    }
    if (address || city || state || country) {
      matchStage.$match.jobLocationType = {
        $ne: "Fully Remote"
      };
    }

    // 📅 Posted within filter
    if (postedWithin) {
      const now = new Date();
      let filterDate;
      switch (postedWithin) {
        case "1day":
          filterDate = new Date(now.setDate(now.getDate() - 1));
          break;
        case "7days":
          filterDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case "15days":
          filterDate = new Date(now.setDate(now.getDate() - 15));
          break;
        case "30days":
          filterDate = new Date(now.setDate(now.getDate() - 30));
          break;
        case "60days":
          filterDate = new Date(now.setDate(now.getDate() - 60));
          break;
      }
      if (filterDate) matchStage.$match.createdAt = { $gte: filterDate };
    }

    if (skills && skills.length > 0) {
      matchStage.$match.skills = { $in: skills };
    }

    const mongoJobs = await Job.aggregate([
      matchStage,
      {
        $lookup: {
          from: "jobsapplieds",
          let: {
            jobId: "$_id",
            candidateId: new mongoose.Types.ObjectId(candidateId),
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$jobId", "$$jobId"] },
                    { $eq: ["$candidateId", "$$candidateId"] },
                  ],
                },
              },
            },
          ],
          as: "appliedJobs",
        },
      },
      {
        $addFields: {
          hasApplied: {
            $cond: {
              if: { $gt: [{ $size: "$appliedJobs" }, 0] },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          employerId: 1,
          title: 1,
          jobType: 1,
          jobLocationType: 1,
          experience: 1,
          payRange: 1,
          location: 1,
          skills: 1,
          hasApplied: 1,
          createdAt: 1,
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: pageSize },
    ]);

    const totalMongoJobs = await Job.countDocuments(matchStage.$match);
   

    // 🔁 External data (JobDiva)
    let jobDivaJobs = [];
    // const ENABLE_JOBDIVA_REALTIME_SYNC =
    //   process.env.ENABLE_JOBDIVA_REALTIME_SYNC === "true";

    const ENABLE_JOBDIVA_REALTIME_SYNC = true;
    if (ENABLE_JOBDIVA_REALTIME_SYNC) {
      try {
        const authService = await import(
          "../../../utils/jobdiva/jobdivaAuth.js"
        );
        if (authService.default.isJobDivaEnabled()) {
          const jobDivaSync = await import(
            "../../jobdiva-service/src/jobSync.js"
          );
          const jobDivaResult = await jobDivaSync.default.pullJobsFromJobDiva(
            filtersForJobDiva
          );
          if (jobDivaResult?.success === true) {
            jobDivaJobs = jobDivaResult.jobs;
          }
        }
      } catch (err) {
        console.error("JobDiva fetch failed:", err);
      }
    }

    const totalAPIJobs = jobDivaJobs.length;

    // 3. Merge data
    const combinedResults = [...mongoJobs, ...jobDivaJobs];

    // 4. Paginate from combined
    let paginatedResults = [];
    if (mongoJobs?.length > 0) {
      paginatedResults = combinedResults.slice(0, pageSize);
    } else {
      const totalMongoPages = Math.ceil(totalMongoJobs / pageSize);
      const jobDivaPage = pageNumber - totalMongoPages;

      if (jobDivaPage > 0) {
        const start = (jobDivaPage - 1) * pageSize;
        const end = start + pageSize;
        paginatedResults = jobDivaJobs.slice(start, end);
      } else {
        paginatedResults = [];
      }
    }

    // 5. Total count
    const totalJobs = totalMongoJobs + totalAPIJobs;

    const uniqueSkillsAgg = await Job.aggregate([
      { $unwind: "$skills" },
      { $group: { _id: null, uniqueSkills: { $addToSet: "$skills" } } },
      { $project: { _id: 0, uniqueSkills: 1 } },
    ]);

    return res.status(200).json({
      success: true,
      message: "Jobs fetched successfully",
      totalJobs,
      totalPages: Math.ceil(totalJobs / pageSize),
      currentPage: pageNumber,
      data: paginatedResults,
      uniqueSkills: uniqueSkillsAgg[0]?.uniqueSkills || [],
    });
  } catch (error) {
    console.error("Error searching jobs:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const addDummyData = async (req, res) => {
  try {
    const { data } = req.body;

    for (let i of data) {
      const x = await CandidateProfile.create(i);
      i.employment[0].candidateProfile = x?._id;
      i.education[0].candidateProfile = x?._id;
      i.skills[0].candidateProfile = x?._id;
      i.languages[0].candidateProfile = x?._id;
      await Employment.create(i?.employment);
      await Education.create(i?.education);
      await Skill.create(i?.skills);
      await Language.create(i?.languages);
    }
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const updatePassword = async (req, res) => {
  try {
    let { email, password } = req.body;

    password = await bcrypt.hash(password, 10);

    const isCandidate = await CandidateProfile.findOne({ email: email });

    const isEmp = await User.findOne({ email: email });

    if (isCandidate) {
      await CandidateProfile.findOneAndUpdate(
        { email: email },
        { $set: { password: password } }
      );
    } else if (isEmp) {
      await User.findOneAndUpdate(
        { email: email },
        { $set: { password: password } }
      );
    } else {
      return res.status(404).json({
        message: "Email is not registered",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Success",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};
