/**
 * JobDiva Job Synchronization Service
 * Handles syncing job postings between NowEdge and JobDiva
 */

import { createJobDivaApiClient } from "../../../utils/jobdiva/jobdivaAuth.js";
import logger from "../../../utils/logger.js";

/**
 * Convert NowEdge job format to JobDiva format
 * @param {Object} nowEdgeJob - Job data in NowEdge format
 * @returns {Object} - Job data in JobDiva format
 * @throws {Error} If required fields are missing
 */
const convertToJobDivaFormat = (nowEdgeJob) => {
  // Validate required fields
  const requiredFields = ["title", "description", "employerId", "experience"];
  // const missingFields = requiredFields.filter((field) => !nowEdgeJob[field]);

  // if (missingFields.length > 0) {
  //   throw new Error(
  //     `Missing required fields for JobDiva sync: ${missingFields.join(", ")}`
  //   );
  // }

  // Validate location data
  // if (
  //   !nowEdgeJob.location ||
  //   !nowEdgeJob.location.city ||
  //   !nowEdgeJob.location.state ||
  //   !nowEdgeJob.location.country
  // ) {
  //   throw new Error("Missing required location fields for JobDiva sync");
  // }

  // Validate salary data
  // if (
  //   !nowEdgeJob.payRange ||
  //   nowEdgeJob.payRange.min === undefined ||
  //   nowEdgeJob.payRange.max === undefined
  // ) {
  //   throw new Error("Missing required salary range fields for JobDiva sync");
  // }

  // Map known job types to JobDiva format
  const jobType = mapJobType(nowEdgeJob.jobType || nowEdgeJob.employmentType);
  // if (!jobType) {
  //   throw new Error("Invalid or missing job type");
  // }

  // Build the JobDiva format object with all required fields here
  const result = {};

  if (nowEdgeJob.title) result.title = nowEdgeJob.title;
  if (nowEdgeJob.externalId) result.jobid = nowEdgeJob.externalId;
  if (nowEdgeJob.description) result.description = nowEdgeJob.description;
  if (jobType) result.jobType = jobType;
  if (nowEdgeJob.payRange?.min) result.minpayrate = nowEdgeJob.payRange.min;
  else result.minpayrate = 0;

  if (nowEdgeJob.payRange?.max) result.maxpayrate = nowEdgeJob.payRange.max;
  else result.maxpayrate = 0;

  if (nowEdgeJob.address) result.address1 = nowEdgeJob.address;
  if (nowEdgeJob.location?.city) result.city = nowEdgeJob.location.city;
  if (nowEdgeJob.location?.state) result.state = nowEdgeJob.location.state;
  if (nowEdgeJob.location?.country)
    result.country = nowEdgeJob.location.country;
  if (nowEdgeJob.location?.postalCode)
    result.zipCode = nowEdgeJob.location.postalCode;

  result.status = 0; // always default
  if (nowEdgeJob.noOfPeople) result.openings = nowEdgeJob.noOfPeople;

  result.companyid = 1; // hardcoded as mentioned

  if (nowEdgeJob.skills?.length)
    result.skills = nowEdgeJob.skills.map((skill) => ({ name: skill }));

  if (nowEdgeJob.experience || nowEdgeJob.experience === 0)
    result.experienceLevel = nowEdgeJob.experience;
  else result.experience = 0;

  return result;
};

/**
 * Map NowEdge job type to JobDiva job type
 * @param {string} nowEdgeJobType - Job type in NowEdge
 * @returns {string} - Equivalent JobDiva job type
 */
const mapJobType = (nowEdgeJobType) => {
  const typeMap = {
    "Full-time": "FULL_TIME",
    "Part-time": "PART_TIME",
    Contract: "CONTRACT",
    Temporary: "TEMPORARY",
    Internship: "INTERNSHIP",
  };

  return typeMap[nowEdgeJobType] || "FULL_TIME";
};

const convertSearchParameters = (nowEdgeJob) => {
  const result = { status: 0 };

  if (nowEdgeJob?.postalCode) {
    result.zipcode = nowEdgeJob.postalCode;
  }
  if (nowEdgeJob?.title) {
    result.title = nowEdgeJob.title;
  }
  if (nowEdgeJob?.country) {
    result.country = nowEdgeJob.country;
  }
  if (nowEdgeJob?.city) {
    result.city = nowEdgeJob.city;
  }
  if (nowEdgeJob?.state) {
    let arr = [];
    arr.push(nowEdgeJob?.state);
    result.state = arr;
  }

  return result;
};

/**
 * Convert JobDiva job format to NowEdge format
 * @param {Object} jobDivaJob - Job data in JobDiva format
 * @returns {Object} - Job data in NowEdge format
 */
const convertToNowEdgeFormat = (jobDivaJob) => {
  return {
    jobTitle: jobDivaJob["job title"],
    description: jobDivaJob["job description"],
    employmentType: mapJobDivaType(jobDivaJob.jobType),
    payRange: {
      min: jobDivaJob["minimum rate"],
      max: jobDivaJob["maximum rate"],
    },
    location: {
      city: jobDivaJob?.city,
      state: jobDivaJob?.state,
      country: jobDivaJob?.country,
      postalCode: jobDivaJob?.zipCode,
    },
    experienceLevel: jobDivaJob?.experienceLevel,
    employerId: jobDivaJob.companyId,
    isRemote: jobDivaJob.isRemote || false,
    status: jobDivaJob["job status"],
    externalId: jobDivaJob.id, // Store JobDiva ID for reference
    externalSource: "JobDiva",
  };
};

/**
 * Map JobDiva job type to NowEdge job type
 * @param {string} jobDivaJobType - Job type in JobDiva
 * @returns {string} - Equivalent NowEdge job type
 */
const mapJobDivaType = (jobDivaJobType) => {
  const typeMap = {
    FULL_TIME: "Full-time",
    PART_TIME: "Part-time",
    CONTRACT: "Contract",
    TEMPORARY: "Temporary",
    INTERNSHIP: "Internship",
  };

  return typeMap[jobDivaJobType] || "Full-time";
};

/**
 * Push a job from NowEdge to JobDiva
 * @param {Object} job - NowEdge job object
 * @returns {Promise<Object>} - Result with JobDiva job ID
 */
export const pushJobToJobDiva = async (job) => {
  try {
    let jobDivaFormatted = convertToJobDivaFormat(job);
    const jobDivaApiClient = await createJobDivaApiClient(jobDivaFormatted);
    logger.info(`Pushing job to JobDiva: ${job.title}`);

    const company = await jobDivaApiClient.post("/jobdiva/searchCompany", {
      company: job?.companyName,
    });

    if (company.data?.length == 0) {
      const companyObj = {
        companyname: job?.companyName,
        email: job?.email,
        phone: job?.phone,
        state: job?.location?.state,
        country: job?.location?.country,
      };

      const newCompany = await jobDivaApiClient.post(
        "/jobdiva/createCompany",
        companyObj
      );
      jobDivaFormatted["companyid"] = newCompany?.data;
    } else {
      jobDivaFormatted["companyid"] = company?.data[0]?.id;
    }

    const response = await jobDivaApiClient.post(
      "/jobdiva/createJob",
      jobDivaFormatted
    );

    if (response.status == 200 && response.data) {
      logger.info(
        `Successfully pushed job to JobDiva with ID: ${response.data}`
      );
      return {
        success: true,
        jobDivaId: response.data,
        message: "Job successfully created in JobDiva",
      };
    } else {
      throw new Error("Failed to get job ID from JobDiva API");
    }
  } catch (error) {
    logger.error(`Error pushing job to JobDiva: ${error}`);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Pull jobs from JobDiva into NowEdge
 * @param {Object} filters - Filters for job search (optional)
 * @returns {Promise<Array>} - Array of jobs in NowEdge format
 */
export const pullJobsFromJobDiva = async (filters = {}) => {
  try {
    const jobDivaApiClient = await createJobDivaApiClient();

    const result = convertSearchParameters(filters);

    logger.info("Pulling jobs from JobDiva with filters:", result);

    let response = await jobDivaApiClient.post("/jobdiva/SearchJob", result);

    if (filters?.minPay || filters?.maxPay) {
      response = response?.data?.filter(
        (s) => s["minimum rate"] >= filters?.minPay
      );
      response = response?.data?.filter(
        (s) => s["maximum rate"] <= filters?.maxPay
      );
    }

    if (filters?.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      response = response?.data?.filter((job) => {
        return (
          job.status?.toLowerCase().includes(query) ||
          job.city?.toLowerCase().includes(query) ||
          job.state?.toLowerCase().includes(query) ||
          job.country?.toLowerCase().includes(query) ||
          job.jobTitle?.toLowerCase().includes(query)
        );
      });
    }

    if (response.data?.length > 0) {
      logger.info(`Retrieved ${response.data?.length} jobs from JobDiva`);

      // Convert each job to NowEdge format
      const nowEdgeJobs = response.data.map(convertToNowEdgeFormat);
      return {
        success: true,
        jobs: nowEdgeJobs,
      };
    } else {
      throw new Error("Invalid response format from JobDiva API");
    }
  } catch (error) {
    logger.error(`Error pulling jobs from JobDiva: ${error.message}`);
    return {
      success: false,
      jobs: [],
      error: error.message,
    };
  }
};

/**
 * Update a job in JobDiva that was originally created from NowEdge
 * @param {string} jobDivaId - JobDiva job ID
 * @param {Object} updatedJob - Updated NowEdge job data
 * @returns {Promise<Object>} - Result of update operation
 */
export const updateJobInJobDiva = async (jobDivaId, updatedJob) => {
  try {
    const jobDivaApiClient = await createJobDivaApiClient();
    const jobDivaFormatted = convertToJobDivaFormat(updatedJob);

    logger.info(`Updating job in JobDiva with ID: ${jobDivaId}`);

    const response = await jobDivaApiClient.post(
      `/jobdiva/updateJob`,
      jobDivaFormatted
    );

    if (response.data && response.status === 200) {
      logger.info(`Successfully updated job in JobDiva with ID: ${jobDivaId}`);
      return {
        success: true,
        message: "Job successfully updated in JobDiva",
      };
    } else {
      throw new Error("Failed to update job in JobDiva");
    }
  } catch (error) {
    logger.error(`Error updating job in JobDiva: ${error.message}`);
    return {
      success: false,
      error: error.message,
    };
  }
};

export default {
  pushJobToJobDiva,
  pullJobsFromJobDiva,
  updateJobInJobDiva,
};
