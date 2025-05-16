import mongoose from "mongoose";
import { sendMail1 } from "../../../utils/sendMail.js";
import {
  CandidateProfile,
  JobApplied,
} from "../../jobseeker-service/src/jobseekerController.js";
import { User } from "../../auth-service/src/auth.controller.js";
import { bookDemo } from "../../../utils/emailTemplate/bookDemo.js";
import { contactUsQueryToNowEdge } from "../../../utils/emailTemplate/contactUsQueryToNowEdge.js";
import { nowEdgeEmails } from "../../../utils/reusableConstants.js";
import { helpDeskTemplateToEmp } from "../../../utils/emailTemplate/helpDeskTemplateToEmp.js";
import { helpDeskTemplateToNowEdge } from "../../../utils/emailTemplate/helpDeskTemplateToNowEdge.js";

const contactUsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
    address: { type: String, required: false },
  },
  { timestamps: true }
);

const issueSchema = new mongoose.Schema({
  problem: {
    type: String,
  },
  date: {
    type: Date,
  },
  time: {
    type: String,
  },
  phone: {
    type: Number,
  },
  empId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const jobSchema = new mongoose.Schema(
  {
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Link to the employer
    title: { type: String, required: true }, // Job title
    jobType: {
      type: String,
      required: true,
    },
    jobLocationType: {
      type: String,
    },
    email: {
      type: String,
    },
    alternativeEmail1: {
      type: String,
    },
    alternativeEmail2: {
      type: String,
    },
    alternativeEmail3: {
      type: String,
    },
    alternativeEmail4: {
      type: String,
    },
    alternativeEmail5: {
      type: String,
    },
    skills: [{ type: String }],
    experience: { type: Number, required: true }, // Required experience, e.g., "6 years"
    payRange: {
      min: { type: Number, required: true }, // Minimum pay
      max: { type: Number, required: true }, // Maximum pay
    },
    payType: {type:String},
    noOfPeople: {
      type: Number,
    },
    phone: {
      type: Number,
    },
    name: {
      type: String,
    },
    companyName: {
      type: String,
    },
    location: {
      city: { type: String},
      state: { type: String},
      postalCode: { type: String},
      country: { type: String},
    },
    benefits: [String], // List of benefits, e.g., ["Health Insurance", "Paid Time Off"]
    description: { type: String, required: true }, // Job description
    status: {
      type: String,
      enum: ["Open", "Closed", "Paused"],
      default: "Open",
    }, // Job status
    companyLogo: {
      type: String,
    },
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

jobSchema.index({ title: "text" });

const DemoSchema = new mongoose.Schema(
  {
    contactName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    companyName: { type: String, required: true },
    companySize: { type: String, required: true }, // Example: "Small", "Medium", "Large"
    preferredDate: { type: Date, required: true },
    preferredTime: { type: String, required: true }, // Example: "10:30 AM"
  },
  { timestamps: true }
);

const JobApplicationViewSchema = new mongoose.Schema({
  jobApplicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JobsApplied",
    required: true,
  },
  employeerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // Employer who viewed
  viewedAt: { type: Date, default: Date.now }, // Timestamp of when viewed
});

const commonMessageSchema = new mongoose.Schema({
  jobApplicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JobsApplied",
    required: true,
  },
  forWhom: {
    type: String,
  },
  isViewed: { type: Boolean },
  createdAt: {
    type: Date,
  },
});

export const Issues = mongoose.model("Issue", issueSchema);

export const CommonMessage = mongoose.model(
  "commonMessage",
  commonMessageSchema
);

export const JobApplicationView = mongoose.model(
  "JobApplicationView",
  JobApplicationViewSchema
);

export const Demo = mongoose.model("Demo", DemoSchema);

export const Job = mongoose.model("Job", jobSchema);

export const ContactUs = mongoose.model("ContactUs", contactUsSchema);

Job.createIndexes();

export const createJobPosting = async (req, res) => {
  try {
    const jobData = req.body; // Get job data from request body

    // Find the user to check subscription limits
    const user = await User.findById(jobData?.employerId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

     console.log(user.subscription);
    // Check if user has an active subscription with available job postings
    if (
      user?.subscription &&
      user?.subscription?.features &&
      user?.subscription?.features?.jobPosting
    ) {
      const { limit, used } = user.subscription.features.jobPosting;

      // Check if user has reached the job posting limit
      if (used >= limit) {
        // return res.status(403).json({
        //   success: false,
        //   message:
        //     "Job posting limit reached. Please upgrade your subscription.",
        // });
      }
    } else {
      // Old subscription checking logic as fallback
      const employerData = await User.aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(jobData?.employerId) },
        },
        {
          $lookup: {
            from: "plans", // Joining with plans collection
            localField: "planId",
            foreignField: "_id",
            as: "planDetails",
          },
        },
        {
          $unwind: "$planDetails", // Ensure plan exists
        },
        {
          $project: {
            _id: 0,
            jobPostings: "$planDetails.jobPostings",
          },
        },
      ]);

      const jobPostings = await Job.countDocuments({
        employerId: new mongoose.Types.ObjectId(jobData?.employerId),
      });

      let maxJobPostings = 0;
      if (!employerData.length) {
        maxJobPostings = 10;
      } else {
        maxJobPostings = employerData[0]?.jobPostings;
      }

      if (maxJobPostings <= jobPostings) {
        return res.status(403).json({ message: "Job Posting limit reached." });
      }
    }
    const jobDataToSave = {
      ...jobData,
      companyName: user?.companyName,
      companyLogo: user?.companyLogo,
    }
    console.log("Job data", jobDataToSave);
    // Create a new job instance
    const newJob = new Job(jobDataToSave);

    // Save job to database
    await newJob.save();

    // Update user subscription usage - increment the used job postings count
    if (
      user.subscription &&
      user.subscription.features &&
      user.subscription.features.jobPosting
    ) {
      // Increment the used count
      user.subscription.features.jobPosting.used += 1;

      // Save the updated user
      await user.save();

      console.log(
        `Job posting count incremented for user ${user._id}. New count: ${user.subscription.features.jobPosting.used}`
      );
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
          const jobDivaSync = await import(
            "../../jobdiva-service/src/jobSync.js"
          );

          // Push the job to JobDiva
          const jobDivaResult = await jobDivaSync.default.pushJobToJobDiva(
            jobData
          );

          if (jobDivaResult.success) {
            // Store the JobDiva ID in the job document for future reference
            newJob.externalId = jobDivaResult.jobDivaId;
            newJob.externalSource = "JobDiva";
            await newJob.save();

            console.log(
              `Job successfully synced to JobDiva with ID: ${jobDivaResult.jobDivaId}`
            );
          } else {
            console.error(
              `Failed to sync job to JobDiva: ${jobDivaResult.error}`
            );
          }
        }
      } catch (syncError) {
        console.error("Error syncing job to JobDiva:", syncError);
        // We don't want to fail the job creation if the sync fails
        // Just log the error and continue
      }
    }

    return res.status(201).json({
      success: true,
      message: "Job posted successfully!",
      job: newJob,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating job posting",
      error: error.message,
    });
  }
};

export const getJobPosting = async (req, res) => {
  try {
    const { employerId, id, page = 1, limit = 8, searchQuery } = req.query;
    const getObj = {};
    if (employerId) {
      getObj.employerId = new mongoose.Types.ObjectId(employerId);
    }
    if (id) {
      getObj._id = new mongoose.Types.ObjectId(id);
    }

    // Build search condition if searchQuery is present
    let searchCondition = {};
    if (searchQuery && searchQuery.trim() !== "") {
      searchCondition = {
        $or: [
          { title: { $regex: searchQuery, $options: "i" } },
          { description: { $regex: searchQuery, $options: "i" } },
          { skills: { $regex: searchQuery, $options: "i" } },
          { "location.city": { $regex: searchQuery, $options: "i" } },
          { "location.state": { $regex: searchQuery, $options: "i" } },
          { "location.country": { $regex: searchQuery, $options: "i" } },
          { "location.postalCode": { $regex: searchQuery, $options: "i" } },
        ]
      };
    }

    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const skip = (pageNumber - 1) * pageSize;

    // Combine filters for $match
    const matchStage = Object.keys(searchCondition).length
      ? { $and: [getObj, searchCondition] }
      : getObj;

    const jobs = await Job.aggregate([
      {
        $match: matchStage
      },
      {
        $lookup: {
          from: "jobsapplieds",
          localField: "_id",
          foreignField: "jobId",
          as: "applications"
        }
      },
      {
        $lookup: {
          from: "jobapplicationviews",
          localField: "_id",
          foreignField: "jobApplicationId",
          as: "views"
        }
      },
      {
        $addFields: {
          totalApplications: { $size: "$applications" },
          totalViews: { $size: "$views" },
          latestApplicationCount: {
            $size: {
              $filter: {
                input: "$applications",
                as: "app",
                cond: {
                  $gt: ["$$app.createdAt", new Date(Date.now() - 3600 * 1000)]
                }
              }
            }
          }
        }
      },
      {
        $project: {
          employerId: 1,
          title: 1,
          jobType: 1,
          jobLocationType: 1,
          email: 1,
          alternativeEmail1: 1,
          alternativeEmail2: 1,
          alternativeEmail3: 1,
          alternativeEmail4: 1,
          alternativeEmail5: 1,
          skills: 1,
          experience: 1,
          payRange: 1,
          payType:1,
          noOfPeople: 1,
          phone: 1,
          name: 1,
          companyName: 1,
          location: 1,
          benefits: 1,
          description: 1,
          status: 1,
          companyLogo: 1,
          externalId: 1,
          externalSource: 1,
          createdAt: 1,
          updatedAt: 1,
          totalApplications: 1,
          totalViews: 1,
          latestApplicationCount: 1
        }
      },
      { $skip: skip },
      { $limit: pageSize }
    ]);

    const totalCount = await Job.countDocuments(matchStage);
    console.log(jobs);
    res.status(200).json({
      success: true,
      message: "Jobs fetched successfully!",
      job: jobs,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      currentPage: pageNumber,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching job postings",
      error: error.message,
    });
  }
};

export const updateJobPosting = async (req, res) => {
  try {
    const { jobId } = req.params; // Get job ID from request parameters
    const updateData = req.body; // Get update data from request body

    // Find and update job
    const updatedJob = await Job.findByIdAndUpdate(jobId, updateData, {
      new: true, // Return updated document
      runValidators: true, // Ensure validation rules are followed
    });

    if (!updatedJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
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
          // If the job has an externalId from JobDiva, update it in JobDiva
          if (
            updatedJob.externalId &&
            updatedJob.externalSource === "JobDiva"
          ) {
            // Import the JobDiva sync service
            const jobDivaSync = await import(
              "../../jobdiva-service/src/jobSync.js"
            );

            // Update the job in JobDiva
            const jobDivaResult = await jobDivaSync.default.updateJobInJobDiva(
              updatedJob.externalId,
              updatedJob
            );

            if (jobDivaResult.success) {
              console.log(
                `Job successfully updated in JobDiva with ID: ${updatedJob.externalId}`
              );
            } else {
              console.error(
                `Failed to update job in JobDiva: ${jobDivaResult.error}`
              );
            }
          } else {
            // If the job doesn't have an externalId, it means it hasn't been synced yet
            // Let's try to sync it now
            // Import the JobDiva sync service
            const jobDivaSync = await import(
              "../../jobdiva-service/src/jobSync.js"
            );

            // Push the job to JobDiva
            const jobDivaResult = await jobDivaSync.default.pushJobToJobDiva(
              updatedJob
            );

            if (jobDivaResult.success) {
              // Store the JobDiva ID in the job document for future reference
              updatedJob.externalId = jobDivaResult.jobDivaId;
              updatedJob.externalSource = "JobDiva";
              await updatedJob.save();

              console.log(
                `Job successfully synced to JobDiva with ID: ${jobDivaResult.jobDivaId}`
              );
            } else {
              console.error(
                `Failed to sync job to JobDiva: ${jobDivaResult.error}`
              );
            }
          }
        }
      } catch (syncError) {
        console.error("Error syncing job to JobDiva:", syncError);
        // We don't want to fail the job update if the sync fails
        // Just log the error and continue
      }
    }

    res.status(200).json({
      success: true,
      message: "Job updated successfully!",
      job: updatedJob,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating job posting",
      error: error.message,
    });
  }
};

export const updateJobAppliedDetails = async (req, res) => {
  try {
    let { id } = req.params; // Get job ID from request parameters

    id = new mongoose.Types.ObjectId(id);

    // Find and update job
    const updatedJobDetails = await JobApplied.findByIdAndUpdate(
      id,
      { status: "INACTIVE" },
      {
        new: true, // Return updated document
        runValidators: true, // Ensure validation rules are followed
      }
    );

    if (!updatedJobDetails) {
      return res.status(404).json({
        success: false,
        message: "Job Applied Details not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Job Applied Details successfully!",
      job: updatedJobDetails,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating job posting",
      error: error.message,
    });
  }
};

export const getJobsWithApplicationStatsHandling = async (req, res) => {
  try {
    const { employerId, status, search } = req.query;
    const getObj = {};
    if (employerId) {
      getObj.employerId = new mongoose.Types.ObjectId(employerId);
    }
    if(status){
      getObj.status = status;
    }

    // If search query exists, use regex for case-insensitive matching
    if (search) {
      getObj["title"] = { $regex: search, $options: "i" };
    }

    const { page = 1, limit = 8 } = req.query; // Default: page 1, 15 jobs per page

    // if (!status) {
    //   return res.status(400).json({ message: "Job Status is required" });
    // }

    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const skip = (pageNumber - 1) * pageSize; // Calculate offset
    let result = await Job.aggregate([
      {
        $lookup: {
          from: "jobsapplieds",
          localField: "_id",
          foreignField: "jobId",
          as: "applications",
        },
      },
      {
        $match: getObj, // Apply filters from frontend
      },
      {
        $addFields: {
          applications: { $ifNull: ["$applications", []] }, // Ensure applications is always an array
          activeApplications: {
            $filter: {
              input: "$applications",
              as: "app",
              cond: { $eq: ["$$app.status", "ACTIVE"] }, // Keep only ACTIVE applications
            },
          },
        },
      },
      {
        $lookup: {
          from: "jobapplicationviews",
          let: {
            jobAppIds: "$applications._id",
            empId: new mongoose.Types.ObjectId(employerId),
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ["$jobApplicationId", "$$jobAppIds"] }, // Match applications for this job
                    { $eq: ["$employeerId", "$$empId"] }, // Only for this employer
                  ],
                },
              },
            },
          ],
          as: "viewedApplications",
        },
      },
      {
        $addFields: {
          totalApplicants: { $size: "$applications" },
          newApplicants: {
            $size: {
              $filter: {
                input: "$applications",
                as: "app",
                cond: {
                  $not: {
                    $in: ["$$app._id", "$viewedApplications.jobApplicationId"], // Exclude applications viewed by this employer
                  },
                },
              },
            },
          },
        },
      },
      {
        $project: {
          title: 1,
          email: 1,
          alternativeEmail1: 1,
          alternativeEmail2: 1,
          location: 1,
          status: 1,
          totalApplicants: 1,
          newApplicants: 1,
          createdAt: 1,
        },
      },
      { $skip: skip }, // Pagination: Skip documents based on page
      { $limit: pageSize }, // Pagination: Limit to requested number of rows
    ]);

    // Get total count of jobs for pagination metadata
    const totalJobs = await Job.countDocuments(getObj);

    return res.status(200).json({
      message: "Jobs fetched successfully",
      totalJobs,
      totalPages: Math.ceil(totalJobs / pageSize),
      currentPage: pageNumber,
      jobs: result,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const updateJobAppliedStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, applicationStatus } = req.query;

    let updateObj = {};
    if (status) updateObj.status = status;
    if (applicationStatus) updateObj.applicationStatus = applicationStatus;

    await JobApplied.findOneAndUpdate({ _id: id }, { $set: updateObj }).then(
      (data) => {
        return res.status(200).json({ success: true, message: "Success" });
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(501).json({
      success: false,
      message: `Something went wrong + ${err}`,
    });
  }
};

export const getAllAppliedCandidatesHandling = async (req, res) => {
  try {
    const { jobId, search } = req.query;
    const { page = 1, limit = 15 } = req.query; // Default: 15 candidates per page

    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required" });
    }

    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const skip = (pageNumber - 1) * pageSize;

    const matchStage = {
      status: "ACTIVE",
      jobId: new mongoose.Types.ObjectId(jobId), // Filter by specific job
    };

    // If search query exists, use regex for case-insensitive matching
    if (search) {
      matchStage["candidateDetails.name"] = { $regex: search, $options: "i" };
    }

    const candidates = await JobApplied.aggregate([
      {
        $lookup: {
          from: "candidateprofiles", // Reference to CandidateProfile collection
          localField: "candidateId",
          foreignField: "_id",
          as: "candidateDetails",
        },
      },
      {
        $match: matchStage, // Match applications for the given job
      },
      {
        $unwind: "$candidateDetails", // Convert array to object
      },
      {
        $project: {
          _id: 0,
          jobApplicationId: "$_id",
          candidateId: "$candidateDetails._id",
          name: "$candidateDetails.name",
          email: "$candidateDetails.email",
          phone: "$candidateDetails.phone",
          resumeLink: "$candidateDetails.resumeLink",
          profileHeadline: "$candidateDetails.profileHeadline",
          address: "$candidateDetails.address",
          appliedAt: 1,
          status: 1,
        },
      },
      { $skip: skip },
      { $limit: pageSize },
    ]);

    // Get total count for pagination metadata
    const totalCandidates = await JobApplied.aggregate([
      {
        $lookup: {
          from: "candidateprofiles", // Join with CandidateProfiles to fetch candidate details
          localField: "candidateId",
          foreignField: "_id",
          as: "candidateDetails",
        },
      },
      {
        $match: matchStage,
      },
      {
        $count: "totalNewCandidates", // Count the number of remaining (unviewed) applications
      },
    ]);

    return res.status(200).json({
      message: "Applied candidates fetched successfully",
      totalCandidates: totalCandidates[0]?.totalNewCandidates,
      totalPages: Math.ceil(
        (totalCandidates[0]?.totalNewCandidates || 0) / pageSize
      ),
      currentPage: pageNumber,
      candidates,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getNewlyAppliedCandidatesHandling = async (req, res) => {
  try {
    const { jobId, employeerId, search } = req.query;
    const { page = 1, limit = 15 } = req.query; // Default: 15 candidates per page

    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required" });
    }

    const matchStage = {
      status: "ACTIVE",
      jobId: new mongoose.Types.ObjectId(jobId), // Filter by specific job
    };

    // If search query exists, use regex for case-insensitive matching
    if (search) {
      matchStage["candidateDetails.name"] = { $regex: search, $options: "i" };
    }

    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const skip = (pageNumber - 1) * pageSize;

    const jobApplicationIds = [];
    const candidates = await JobApplied.aggregate([
      {
        $lookup: {
          from: "jobapplicationviews", // Join with JobApplicationView
          localField: "_id",
          foreignField: "jobApplicationId",
          as: "views",
        },
      },
      {
        $match: {
          "views.employeerId": {
            $ne: new mongoose.Types.ObjectId(employeerId),
          }, // Exclude applications viewed by this employer
        },
      },
      {
        $lookup: {
          from: "candidateprofiles", // Join with CandidateProfiles to fetch candidate details
          localField: "candidateId",
          foreignField: "_id",
          as: "candidateDetails",
        },
      },
      {
        $match: matchStage,
      },
      {
        $unwind: "$candidateDetails", // Flatten the candidate details array
      },
      {
        $project: {
          _id: 0,
          jobApplicationId: "$_id",
          candidateId: "$candidateDetails._id",
          name: "$candidateDetails.name",
          email: "$candidateDetails.email",
          resumeLink: "$candidateDetails.resumeLink",
          phone: "$candidateDetails.phone",
          profileHeadline: "$candidateDetails.profileHeadline",
          address: "$candidateDetails.address",
          appliedAt: 1,
          status: 1,
        },
      },
      { $skip: skip }, // Pagination: Skip the first 'skip' documents
      { $limit: pageSize }, // Pagination: Limit the number of documents to 'pageSize'
    ]);

    for (let i of candidates) {
      jobApplicationIds.push({
        jobApplicationId: i?.jobApplicationId,
        employeerId: employeerId,
      });
    }

    // Get total count for pagination metadata
    const totalNewCandidates = await JobApplied.aggregate([
      {
        $lookup: {
          from: "candidateprofiles", // Join with CandidateProfiles to fetch candidate details
          localField: "candidateId",
          foreignField: "_id",
          as: "candidateDetails",
        },
      },
      {
        $match: matchStage,
      },
      {
        $lookup: {
          from: "jobapplicationviews", // Join with JobApplicationView
          localField: "_id",
          foreignField: "jobApplicationId",
          as: "views",
        },
      },
      {
        $match: {
          "views.employeerId": {
            $ne: new mongoose.Types.ObjectId(employeerId),
          }, // Exclude viewed applications
        },
      },
      {
        $count: "totalNewCandidates", // Count the number of remaining (unviewed) applications
      },
    ]);

    await JobApplicationView.insertMany(jobApplicationIds).catch((err) => {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Internal server error", error: err.message });
    });

    return res.status(200).json({
      message: "Newly applied candidates fetched successfully",
      totalPages: Math.ceil(
        totalNewCandidates[0]?.totalNewCandidates
          ? totalNewCandidates[0]?.totalNewCandidates
          : 0 / pageSize
      ),
      currentPage: pageNumber,
      candidates,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const createDemoHandling = async (req, res) => {
  try {
    const {
      contactName,
      email,
      phone,
      companyName,
      companySize,
      preferredDate,
      preferredTime,
    } = req.body;

    if (
      !contactName ||
      !email ||
      !phone ||
      !companyName ||
      !companySize ||
      !preferredDate ||
      !preferredTime
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const DemoContact = new Demo({
      contactName,
      email,
      phone,
      companyName,
      companySize,
      preferredDate,
      preferredTime,
    });

    await DemoContact.save();

    const { from, subject } = req.body;

    const emails = ["vishweshjha@gmail.com", "nextcommon321@gmail.com"];

    for (let i of emails) {
      await sendMail1(
        from,
        i,
        subject,
        bookDemo(contactName, email, phone)
      ).catch((err) => {
        console.log(err);
        return res.status(501).json({
          success: false,
          message: `Something went wrong + ${err}`,
        });
      });
    }
    return res
      .status(201)
      .json({ message: "Demo created successfully", data: DemoContact });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getAllDemos = async (req, res) => {
  try {
    let obj = {};
    const { id } = req.query;
    if (id) obj._id = new mongoose.Types.ObjectId(id);
    const contacts = await Demo.find(obj).sort({ createdAt: -1 }); // Fetch all contacts, sorted by latest first
    return res
      .status(200)
      .json({ message: "Demos fetched successfully", data: contacts });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getCandidatesWithJobsApplied = async (req, res) => {
  try {
    const { page = 1, limit = 8, search = "", employerId } = req.query;

    const pageSize = parseInt(limit, 10);
    const pageNumber = parseInt(page, 10);

    const matchStage = {
      status: "ACTIVE",
    };

    // If search query exists, use regex for case-insensitive matching
    if (search) {
      matchStage["candidate.name"] = { $regex: search, $options: "i" };
    }

    if (employerId) {
      matchStage["job.employerId"] = new mongoose.Types.ObjectId(employerId);
    }

    console.log(matchStage);
    const result = await JobApplied.aggregate([
      {
        $lookup: {
          from: "jobs",
          localField: "jobId",
          foreignField: "_id",
          as: "job",
        },
      },
      { $unwind: "$job" },
      { $match: matchStage },
      {
        $lookup: {
          from: "candidateprofiles",
          localField: "candidateId",
          foreignField: "_id",
          as: "candidate",
        },
      },
      { $unwind: "$candidate" },
      {
        $project: {
          _id: 0,
          jobApplicationId: "$_id",
          candidateId: "$candidate._id",
          candidateName: "$candidate.name",
          city: "$candidate.city",
          state: "$candidate.state",
          country: "$candidate.country",
          candidateEmail: "$candidate.email",
          candidatePhone: "$candidate.phone",
          candidateAddress: "$candidate.address",
          appliedAt: 1,
          jobId: "$job._id",
          jobTitle: "$job.title",
        },
      },
      { $sort: { appliedAt: -1 } },
      { $skip: (pageNumber - 1) * pageSize },
      { $limit: pageSize },
    ]);

    const totalCount = await JobApplied.aggregate([
      {
        $lookup: {
          from: "candidateprofiles",
          localField: "candidateId",
          foreignField: "_id",
          as: "candidate",
        },
      },
      { $unwind: "$candidate" },
      {
        $lookup: {
          from: "jobs",
          localField: "jobId",
          foreignField: "_id",
          as: "job",
        },
      },
      { $unwind: "$job" },
      { $match: matchStage },
      { $count: "totalCount" },
    ]);

    return res.status(200).json({
      message: "Candidates Data Sent Successfully",
      totalCount: totalCount[0]?.totalCount,
      totalPages: Math.ceil((totalCount[0]?.totalCount || 0) / pageSize),
      currentPage: pageNumber,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching candidates with jobs applied:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getResumeLink = async (req, res) => {
  try {
    const { employerId, candidateId } = req.query;

    if (!employerId || !candidateId) {
      return res
        .status(400)
        .json({ message: "EmployerId and CandidateId are required" });
    }

    // Find the user to check subscription limits
    const user = await User.findById(employerId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user has an active subscription with available resume views
    if (
      user.subscription &&
      user.subscription.features &&
      user.subscription.features.resumeViews
    ) {
      const { limit, used } = user.subscription.features.resumeViews;

      // Check if user has reached the resume views limit
      if (used >= limit) {
        return res.status(403).json({
          success: false,
          message:
            "Resume views limit reached. Please upgrade your subscription.",
        });
      }
    } else {
      // Old subscription checking logic as fallback
      const employerData = await User.aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(employerId) },
        },
        {
          $lookup: {
            from: "plans", // Joining with plans collection
            localField: "planId",
            foreignField: "_id",
            as: "planDetails",
          },
        },
        {
          $unwind: "$planDetails", // Ensure plan exists
        },
        {
          $project: {
            _id: 0,
            resumeDownloadCount: 1,
            resumeViews: "$planDetails.resumeViews",
          },
        },
      ]);

      if (!employerData.length) {
        return res
          .status(404)
          .json({ message: "Employer not found or no associated plan." });
      }

      const { resumeDownloadCount, resumeViews } = employerData[0];

      if (resumeDownloadCount >= resumeViews) {
        return res
          .status(403)
          .json({ message: "Resume download limit reached." });
      }
    }

    const candidateData = await CandidateProfile.findOne(
      { _id: new mongoose.Types.ObjectId(candidateId) },
      { resumeLink: 1 }
    );

    if (!candidateData) {
      return res.status(404).json({ message: "Candidate not found." });
    }

    // Update user subscription usage - increment the used resume views count
    if (
      user.subscription &&
      user.subscription.features &&
      user.subscription.features.resumeViews
    ) {
      // Increment the used count
      user.subscription.features.resumeViews.used += 1;

      // Save the updated user
      await user.save();

      console.log(
        `Resume views count incremented for user ${user._id}. New count: ${user.subscription.features.resumeViews.used}`
      );
    } else {
      // Fallback to old method
      let prevCount = 0;
      await User.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(employerId) },
        { $set: { resumeDownloadCount: prevCount + 1 } }
      );
    }

    return res.status(200).json({
      success: true,
      resumeLink: candidateData.resumeLink,
    });
  } catch (error) {
    console.error("Error fetching resume link:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const createContactUs = async (req, res) => {
  try {
    const { name, email, phone, message, address } = req.body;

    const newInquiry = new ContactUs({
      name,
      email,
      phone,
      message,
      address,
    });

    await newInquiry.save();

    const totalQueries = await ContactUs.countDocuments().catch((err) => {
      console.log(err);
    });

    const emails = ["nextcommon321@gmail.com"];

    for (let i of emails) {
      await sendMail1(
        email,
        i,
        `New Contact Us Query from ${name}`,
        contactUsQueryToNowEdge(name, message, email, phone, totalQueries)
      );
    }

    return res.status(201).json({
      success: true,
      message: "Contact inquiry submitted successfully",
      data: newInquiry,
    });
  } catch (error) {
    console.error("Error submitting contact inquiry:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getAllContactUs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const skip = (pageNumber - 1) * pageSize;

    const inquiries = await ContactUs.find()
      .sort({ createdAt: -1 }) // Sort by latest first
      .skip(skip)
      .limit(pageSize);

    const totalInquiries = await ContactUs.countDocuments();

    return res.status(200).json({
      success: true,
      message: "Contact inquiries fetched successfully",
      totalInquiries,
      totalPages: Math.ceil(totalInquiries / pageSize),
      currentPage: pageNumber,
      data: inquiries,
    });
  } catch (error) {
    console.error("Error fetching contact inquiries:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const convertToJobDivaPayload = (filters = {}) => {
  const { searchQuery, name, city, state, postalCode, country } = filters;

  return {
    city: city || "",
    state: state || "",
    zipCode: postalCode || "",
    country: country || "",
    firstName: name || searchQuery || "",
  };
};

export const getRecommendedCandidates = async (req, res) => {
  try {
    const {
      jobTitle,
      skills,
      experience,
      city,
      state,
      postalCode,
      address,
      country,
      page = 1,
      limit = 10,
      searchQuery,
    } = req.body;
    console.log(req.body);

    const filtersForJobDiva = convertToJobDivaPayload(req.body);

    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const skip = (pageNumber - 1) * pageSize;

    const matchStage = { $match: {} };

    if (jobTitle)
      matchStage.$match["desiredJobTitle"] = {
        $regex: jobTitle,
        $options: "i",
      };
    if (skills?.length > 0) matchStage.$match.skills = { $in: skills };
    if (experience)
      matchStage.$match.experience = { $gte: parseInt(experience, 10) };
    if(address) {
      matchStage.$match["$or"] = [
        { "city": { $regex: address, $options: "i" } },
        { "state": { $regex: address, $options: "i" } },
        { "postalCode": { $regex: address, $options: "i" } },
        { "country": { $regex: address, $options: "i" } }
      ];
    }
    if (city)
      matchStage.$match["city"] = { $regex: city, $options: "i" };
    if (state)
      matchStage.$match["state"] = { $regex: state, $options: "i" };
    if (postalCode)
      matchStage.$match["postalCode"] = {
        $regex: postalCode,
        $options: "i",
      };
    if (country)
      matchStage.$match["country"] = {
        $regex: country,
        $options: "i",
      };

    if (searchQuery) {
      const experienceValue = parseInt(searchQuery, 10);
      matchStage.$match.$or = [
        { desiredJobTitle: { $regex: searchQuery, $options: "i" } },
        { "city": { $regex: searchQuery, $options: "i" } },
        { "state": { $regex: searchQuery, $options: "i" } },
        { "country": { $regex: searchQuery, $options: "i" } },
        { "postalCode": { $regex: searchQuery, $options: "i" } },
        { skills: { $regex: searchQuery, $options: "i" } },
        ...(isNaN(experienceValue)
          ? []
          : [{ experience: { $gte: experienceValue } }]),
      ];
    }

    // 1. Fetch MongoDB candidates
    // const mongoCandidates = await CandidateProfile.aggregate([
    //   matchStage,
    //   { $sort: { createdAt: -1 } },
    //   { $skip: skip },
    //   { $limit: pageSize },
    // ]);
    const mongoCandidates = await CandidateProfile.aggregate([
      {
        $lookup: {
          from: "skills", // Join with the skills collection
          localField: "_id",
          foreignField: "candidateProfile",
          as: "candidateSkills"
        }
      },
      {
        $match: {
          $or: [
            { "candidateSkills.name": { $in: skills } },
            { experience: { $gte: experience } }
          ]
        }
      },
      {
        $addFields: {
          matchedSkillsCount: {
            $size: {
              $filter: {
                input: "$candidateSkills",
                as: "skill",
                cond: { $in: ["$$skill.name", skills] }
              }
            }
          }
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          phone: 1,
          experience: 1,
          city: 1,
          state: 1,
          country: 1,
          postalCode: 1,
          skills: "$candidateSkills.name", // Project the skill names from joined skills
          resumeLink: 1,
          profileHeadline: 1,
          matchedSkillsCount: 1
        }
      },
      {
        $sort: { matchedSkillsCount: -1 } // Sort by number of matched skills
      }
    ]);

    const totalMongoCandidates = await CandidateProfile.countDocuments(
      matchStage.$match
    );

    // 2. Fetch from JobDiva
    let jobDivaCandidates = [];
    // const ENABLE_JOBDIVA_REALTIME_SYNC =
    //   process.env.ENABLE_JOBDIVA_REALTIME_SYNC === "true";

    const ENABLE_JOBDIVA_REALTIME_SYNC = true;

    if (ENABLE_JOBDIVA_REALTIME_SYNC) {
      try {
        const authService = await import(
          "../../../utils/jobdiva/jobdivaAuth.js"
        );
        // if (authService.default.isJobDivaEnabled()) {
        const divaService = await import(
          "../../jobdiva-service/src/candidateSync.js"
        );
        const result = await divaService.default.pullCandidatesFromJobDiva(
          filtersForJobDiva
        );

        if (result?.success === true) {
          jobDivaCandidates = result.candidates;
        }
        // }
      } catch (err) {
        console.error("JobDiva candidate fetch failed:", err);
      }
    }

    const totalAPICandidates = jobDivaCandidates.length;

    // 3. Merge data
    const combinedResults = [...mongoCandidates, ...jobDivaCandidates];

    // 4. Paginate merged result
    let paginatedResults = [];
    if (mongoCandidates.length > 0) {
      paginatedResults = combinedResults.slice(0, pageSize);
    } else {
      const totalMongoPages = Math.ceil(totalMongoCandidates / pageSize);
      const divaPage = pageNumber - totalMongoPages;

      if (divaPage > 0) {
        const start = (divaPage - 1) * pageSize;
        const end = start + pageSize;
        paginatedResults = jobDivaCandidates.slice(start, end);
      }
    }

    const totalCandidates = totalMongoCandidates + totalAPICandidates;

    return res.status(200).json({
      success: true,
      message: "Recommended candidates fetched successfully",
      totalCandidates,
      totalPages: Math.ceil(totalCandidates / pageSize),
      currentPage: pageNumber,
      data: paginatedResults,
    });
  } catch (error) {
    console.error("Error in getRecommendedCandidates:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const updateCommonMessage = async (req, res) => {
  try {
    const { candidateIds } = req.body;

    await CommonMessage.updateMany(
      { _id: { $in: candidateIds } }, // Match all candidate IDs
      { $set: { isViewed: true } } // Apply the same update
    );

    return res
      .status(200)
      .json({ success: true, message: "Sucessfully Sent Details" });
  } catch (error) {
    console.error("Error searching candidates:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const createIssue = async (req, res) => {
  try {
    const { problem, date, time, empId, phone} = req.body;

    const emp = await User.findOne({ _id: empId });

    const newIssue = new Issues({
      problem,
      date,
      time,
      empId,
      phone
    });

    const totalIssues = await Issues.countDocuments();

    await newIssue.save();
    const data = {
      ...newIssue,
      ticketNo: totalIssues,
      email: emp?.email,
      name: emp?.name,
      contactNo: emp?.phone,
    };
    return res.status(201).json({
      success: true,
      data: data?._doc,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

function convertTo12HourFormat(timeStr) {
  if (!timeStr) return "";

  const [hourStr, minuteStr] = timeStr.split(":");
  let hour = parseInt(hourStr, 10);
  const minute = minuteStr.padStart(2, "0");
  const period = hour >= 12 ? "PM" : "AM";

  // Convert hour from 24-hour to 12-hour format
  hour = hour % 12 || 12;

  return `${hour}:${minute} ${period}`;
}

export const finishUpHelpDesk = async (req, res) => {
  try {
    let { phone, id, empId } = req.body;

    const emp = await User.findOne({ _id: empId });

    if (!phone) {
      phone = emp?.phone;
    }

    if (phone) {
      await Issues.findOneAndUpdate({ _id: id }, { $set: { phone: phone } });
    }

    const issue = await Issues.findOne({ _id: id });

    await sendMail1(
      nowEdgeEmails[0],
      emp?.email,
      "Email from NowEdge Addressing your Issue",
      helpDeskTemplateToEmp(
        emp?.name,
        emp?.email,
        phone,
        issue?.date?.toISOString()?.split("T")[0],
        convertTo12HourFormat(issue?.time),
        nowEdgeEmails[0]
      )
    );
    for (let i of nowEdgeEmails) {
      await sendMail1(
        emp?.email,
        i,
        "Ticket Raised By Employee From Help Desk",
        helpDeskTemplateToNowEdge(
          emp?.name,
          emp?.email,
          issue?.date?.toISOString()?.split("T")[0],
          convertTo12HourFormat(issue?.time),
          phone
        )
      );
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllIssues = async (req, res) => {
  try {
    const issues = await Issues.find().sort({ date: -1 });
    return res.json({ success: true, data: issues });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const updateIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const { phone } = req.query;
    const issues = await Issues.findOneAndUpdate(
      { _id: id },
      { $set: { phone: phone } },
      { new: true }
    );
    return res.json({ success: true, data: issues });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
