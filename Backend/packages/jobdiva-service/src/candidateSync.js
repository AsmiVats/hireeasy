/**
 * JobDiva Candidate Synchronization Service
 * Handles syncing candidate profiles between NowEdge and JobDiva
 */

import { createJobDivaApiClient } from "../../../utils/jobdiva/jobdivaAuth.js";
import logger from "../../../utils/logger.js";
import axios from "axios";
import FormData from "form-data";

/**
 * Convert NowEdge candidate format to JobDiva format
 * @param {Object} nowEdgeCandidate - Candidate data in NowEdge format
 * @returns {Object} - Candidate data in JobDiva format
 * @throws {Error} If required fields are missing
 */

const convertToJobDivaCandidateFormat = (candidateData) => {
  // Validate required fields
  const requiredFields = [
    "name",
    "phone",
    "email",
    "city",
    "state",
    "country",
    "zipcode",
  ];
  const missingFields = requiredFields.filter((field) => !candidateData[field]);

  // if (missingFields.length > 0) {
  //   throw new Error(
  //     `Missing required candidate fields for JobDiva sync: ${missingFields.join(
  //       ", "
  //     )}`
  //   );
  // }

  // Split full name into firstName and lastName
  const [firstName, ...lastParts] = candidateData.name.trim().split(" ");
  const lastName = lastParts.join(" ") || "Unknown";

  // Construct the JobDiva candidate object
  const jobDivaCandidate = {
    firstName,
    lastName,
    cellphone: candidateData.phone,
    email: candidateData.email,
    city: candidateData.city,
    state: candidateData.state,
    zipCode: candidateData.zipcode,
    countryid: candidateData.country,
    address1: candidateData.address || "",
    years: candidateData.yearsOfExperience || 0,
    currentsalary: candidateData.payScale || 0,
    currentsalaryunit: candidateData.payType || "yearly",
    narrative: candidateData.profileHeadline || "",
  };

  return jobDivaCandidate;
};

const convertSearchParameters = (payload = {}) => {
  const { city, firstName, state, zipCode, country } = payload;

  return {
    city: city || "",
    firstName: firstName || "",
    state: state || "",
    zipCode: zipCode || "",
    country: country || "",
  };
};

// Transform JobDiva response to your internal candidate format
const transformJobDivaCandidate = (candidate) => {
  console.log("Candidate -", candidate);

  const firstName = candidate?.["first name"] || "";
  const middleInitial = candidate?.["middle initial"] || "";
  const lastName = candidate?.["last name"] || "";

  const fullName = [firstName, middleInitial, lastName]
    .filter(Boolean)
    .join(" ");

  const primaryPhone =
    candidate?.["phone 3"]?.match(/\d{10}/)?.[0] ||
    candidate?.["phone 2"]?.match(/\d{10}/)?.[0] ||
    candidate?.["phone 1"]?.match(/\d{10}/)?.[0] ||
    "";

  return {
    source: "jobdiva",
    candidateId: candidate?.id,
    name: fullName,
    email: candidate?.email || candidate?.["alternate email"] || "",
    phone: primaryPhone,
    experience: 0, // Not available in this response
    desiredJobTitle: "", // Not available in this response
    location: {
      city: candidate?.city || "",
      state: candidate?.state || "",
      postalCode: candidate?.zipcode || "",
      country: candidate?.country || "",
    },
    skills: [], // Not available in this response
    createdAt: new Date(), // No field in response, so fallback to now
  };
};

/**
 * Upload a resume to JobDiva for a candidate
 * @param {string} candidateId - JobDiva candidate ID
 * @param {string} resumeUrl - URL to the resume file
 * @returns {Promise<Object>} - Response from JobDiva API
 */
const uploadResumeToJobDiva = async (candidateId, resumeUrl) => {
  try {
    // Validate parameters
    if (!candidateId) {
      throw new Error("JobDiva candidateId is required for resume upload");
    }

    if (!resumeUrl) {
      throw new Error("Resume URL is required for resume upload");
    }

    logger.info(
      `Uploading resume for candidate ID ${candidateId} from URL: ${resumeUrl}`
    );

    // Get authenticated API client
    const apiClient = await createJobDivaApiClient();

    // Download the resume file from the URL
    let resumeData;
    try {
      // Set timeout and validate URL before downloading
      const timeout = 15000; // 15 seconds timeout
      const validUrlPattern = /^https?:\/\/.+/i;

      if (!validUrlPattern.test(resumeUrl)) {
        throw new Error(`Invalid resume URL format: ${resumeUrl}`);
      }

      const response = await axios.get(resumeUrl, {
        responseType: "arraybuffer",
        timeout: timeout,
        validateStatus: (status) => status >= 200 && status < 300,
      });

      resumeData = response.data;

      // Validate resumeData
      if (!resumeData || resumeData.byteLength === 0) {
        throw new Error("Downloaded resume file is empty");
      }

      if (resumeData.byteLength > 10 * 1024 * 1024) {
        // 10MB limit
        throw new Error("Resume file exceeds maximum size of 10MB");
      }

      logger.info(
        `Successfully downloaded resume file, size: ${resumeData.byteLength} bytes`
      );
    } catch (downloadError) {
      if (downloadError.code === "ECONNABORTED") {
        throw new Error(
          `Resume download timed out after ${timeout / 1000} seconds`
        );
      }

      if (downloadError.response) {
        throw new Error(
          `Failed to download resume: HTTP ${downloadError.response.status} from URL source`
        );
      }

      logger.error("Error downloading resume file:", downloadError.message);
      throw new Error(`Failed to download resume: ${downloadError.message}`);
    }

    // Extract file extension from URL and verify content type
    const fileExtension = resumeUrl.split(".").pop().toLowerCase();
    const allowedExtensions = ["pdf", "doc", "docx", "txt", "rtf"];

    if (!allowedExtensions.includes(fileExtension)) {
      logger.warn(
        `Resume file has unusual extension: ${fileExtension}. JobDiva may reject this file type.`
      );
    }

    // Prepare the upload data
    const formData = new FormData();
    formData.append("candidateId", candidateId);
    formData.append(
      "resumeFile",
      new Blob([resumeData]),
      `resume.${fileExtension}`
    );
    formData.append("setAsDefault", "true");

    // Upload to JobDiva
    const uploadResponse = await apiClient.post(
      "/candidates/resume/upload",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000, // 30 seconds timeout for upload
      }
    );

    logger.info(
      `Successfully uploaded resume to JobDiva for candidate ID ${candidateId}`
    );
    return uploadResponse.data;
  } catch (error) {
    logger.error("Error uploading resume to JobDiva:", error.message);

    // Provide more specific error information
    if (error.response) {
      logger.error("JobDiva API error details:", {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
      });

      throw new Error(
        `JobDiva API rejected resume upload: ${error.response.status} ${error.response.statusText}`
      );
    }

    // Rethrow with clear message for the caller
    throw new Error(`Failed to upload resume to JobDiva: ${error.message}`);
  }
};

/**
 * Push a candidate from NowEdge to JobDiva
 * @param {Object} candidate - Candidate data in NowEdge format
 * @returns {Promise<Object>} - Result of the push operation
 */
export const pushCandidateToJobDiva = async (candidate) => {
  try {
    // Validate required fields
    // if (!candidate || !candidate.name || !candidate.email) {
    //   throw new Error('Missing required candidate data for JobDiva push: name, email');
    // }

    // Convert to JobDiva format
    const jobDivaCandidate = convertToJobDivaCandidateFormat(candidate);

    console.log(jobDivaCandidate);

    // Get authenticated API client
    const apiClient = await createJobDivaApiClient();

    logger.info(`Pushing candidate ${candidate.name} to JobDiva`);

    // Create candidate in JobDiva
    const response = await apiClient.post(
      "/jobdiva/createCandidate",
      jobDivaCandidate
    );

    console.log(response);

    if (!response.data) {
      throw new Error("JobDiva API responded without a candidate ID");
    }

    const candidateId = response.data;
    logger.info(
      `Successfully pushed candidate ${candidate.name} to JobDiva with ID: ${candidateId}`
    );

    // If resume URL is provided, upload the resume
    // if (candidate.resumeUrl || candidate.resumeLink) {
    //   const resumeUrl = candidate.resumeUrl || candidate.resumeLink;
    //   try {
    //     await uploadResumeToJobDiva(candidateId, resumeUrl);
    //     logger.info(`Resume uploaded successfully for candidate: ${candidate.name}`);
    //     return {
    //       success: true,
    //       jobDivaId: candidateId,
    //       message: 'Candidate created and resume uploaded in JobDiva',
    //       resumeUploaded: true
    //     };
    //   } catch (resumeError) {
    //     logger.error(`Failed to upload resume, but candidate was created: ${resumeError.message}`);
    //     return {
    //       success: true,
    //       jobDivaId: candidateId,
    //       message: 'Candidate created in JobDiva, but resume upload failed',
    //       resumeUploaded: false,
    //       resumeError: resumeError.message
    //     };
    //   }
    // }

    return {
      success: true,
      jobDivaId: candidateId,
      message: "Candidate created in JobDiva",
    };
  } catch (error) {
    logger.error(`Error pushing candidate to JobDiva: ${error.message}`);

    // Provide more detailed error information if available
    if (error.response) {
      logger.error("JobDiva API error details:", {
        status: error.response.status,
        data: error.response.data,
      });
    }

    return {
      success: false,
      error: `Failed to push candidate to JobDiva: ${error.message}`,
    };
  }
};

/**
 * Pull candidates from JobDiva to NowEdge
 * @param {Object} filters - Optional filters for JobDiva candidates
 * @param {Object} options - Optional parameters like pagination
 * @returns {Promise<Object>} - List of candidates in NowEdge format
 */

export const pullCandidatesFromJobDiva = async (filters = {}) => {
  try {
    let queryBody = convertSearchParameters(filters);
    const apiClient = await createJobDivaApiClient();
    let response = await apiClient.post(
      "/jobdiva/searchCandidateProfile",
      queryBody
    );

    const result = response.data;

    if (!Array.isArray(result)) {
      return {
        success: false,
        message: "Invalid response from JobDiva",
        candidates: [],
      };
    }

    const transformedCandidates = result.map(transformJobDivaCandidate);

    return {
      success: true,
      candidates: transformedCandidates,
    };
  } catch (error) {
    console.error("Error pulling candidates from JobDiva:", error.message);
    return {
      success: false,
      message: error.message,
      candidates: [],
    };
  }
};

/**
 * Update a candidate in JobDiva that was originally created from NowEdge
 * @param {string} jobDivaId - JobDiva candidate ID
 * @param {Object} updatedCandidate - Updated NowEdge candidate data
 * @returns {Promise<Object>} - Result of update operation
 */
export const updateCandidateInJobDiva = async (jobDivaId, updatedCandidate) => {
  try {
    // Validate parameters
    if (!jobDivaId) {
      throw new Error("JobDiva candidate ID is required for update");
    }

    if (!updatedCandidate || typeof updatedCandidate !== "object") {
      throw new Error("Invalid candidate data provided for update");
    }

    // Log candidate name if available for better tracking
    const candidateName = updatedCandidate.name || "Unknown";
    logger.info(
      `Updating candidate ${candidateName} in JobDiva with ID: ${jobDivaId}`
    );

    // Convert to JobDiva format
    const jobDivaFormatted = convertToJobDivaCandidateFormat(updatedCandidate);

    // Get authenticated API client
    const jobDivaApiClient = await createJobDivaApiClient();

    // Update candidate in JobDiva
    const response = await jobDivaApiClient.put(
      `/candidates/${jobDivaId}`,
      jobDivaFormatted
    );

    if (!response.data || response.status !== 200) {
      throw new Error(
        "JobDiva API returned an unexpected response during update"
      );
    }

    logger.info(
      `Successfully updated candidate ${candidateName} in JobDiva with ID: ${jobDivaId}`
    );

    // If resume URL is provided, try to upload it
    if (updatedCandidate.resumeUrl || updatedCandidate.resumeLink) {
      const resumeUrl =
        updatedCandidate.resumeUrl || updatedCandidate.resumeLink;
      try {
        logger.info(
          `Attempting to update resume for candidate ${candidateName}`
        );
        await uploadResumeToJobDiva(jobDivaId, resumeUrl);
        logger.info(
          `Resume updated successfully for candidate: ${candidateName}`
        );
        return {
          success: true,
          jobDivaId: jobDivaId,
          message: "Candidate updated and resume uploaded in JobDiva",
          resumeUploaded: true,
        };
      } catch (resumeError) {
        logger.error(
          `Failed to upload resume, but candidate was updated: ${resumeError.message}`
        );
        return {
          success: true,
          jobDivaId: jobDivaId,
          message: "Candidate updated in JobDiva, but resume upload failed",
          resumeUploaded: false,
          resumeError: resumeError.message,
        };
      }
    }

    return {
      success: true,
      jobDivaId: jobDivaId,
      message: "Candidate successfully updated in JobDiva",
    };
  } catch (error) {
    logger.error(
      `Error updating candidate in JobDiva (ID: ${jobDivaId}): ${error.message}`
    );

    // Provide more detailed error information if available
    if (error.response) {
      logger.error("JobDiva API error details:", {
        status: error.response.status,
        data: error.response.data,
      });
    }

    return {
      success: false,
      error: `Failed to update candidate in JobDiva: ${error.message}`,
    };
  }
};

/**
 * Upload a resume document for a candidate in JobDiva
 * @param {string} jobDivaId - JobDiva candidate ID
 * @param {Buffer} resumeBuffer - Resume file buffer
 * @param {string} fileName - Original file name
 * @returns {Promise<Object>} - Result of upload operation
 */
export const uploadCandidateResume = async (
  jobDivaId,
  resumeBuffer,
  fileName
) => {
  try {
    // Validate inputs
    if (!jobDivaId) {
      throw new Error("JobDiva candidate ID is required for resume upload");
    }

    if (
      !resumeBuffer ||
      !(resumeBuffer instanceof Buffer) ||
      resumeBuffer.length === 0
    ) {
      throw new Error("Valid resume file content is required for upload");
    }

    if (!fileName) {
      fileName = "resume.pdf"; // Default filename if none provided
      logger.warn(
        `No filename provided for resume upload, using default: ${fileName}`
      );
    }

    // Validate file size
    if (resumeBuffer.length > 10 * 1024 * 1024) {
      // 10MB limit
      throw new Error("Resume file exceeds maximum size of 10MB");
    }

    // Extract and validate file extension
    const fileExtension = fileName.split(".").pop().toLowerCase();
    const allowedExtensions = ["pdf", "doc", "docx", "txt", "rtf"];

    if (!allowedExtensions.includes(fileExtension)) {
      logger.warn(
        `Resume file has unusual extension: ${fileExtension}. JobDiva may reject this file type.`
      );
    }

    // Get authenticated API client
    const jobDivaApiClient = await createJobDivaApiClient();

    logger.info(
      `Uploading resume (${resumeBuffer.length} bytes) for candidate in JobDiva with ID: ${jobDivaId}`
    );

    // Convert buffer to base64 for API transmission
    const base64Resume = resumeBuffer.toString("base64");

    // Send the upload request with a timeout
    const response = await jobDivaApiClient.post(
      `/candidates/${jobDivaId}/documents`,
      {
        documentName: fileName,
        documentType: "RESUME",
        documentContent: base64Resume,
      },
      {
        timeout: 60000, // 60 second timeout for large files
      }
    );

    // Validate the response
    if (!response.data || !response.data.documentId) {
      throw new Error(
        "JobDiva API returned an invalid response for document upload"
      );
    }

    logger.info(
      `Successfully uploaded resume in JobDiva with document ID: ${response.data.documentId}`
    );
    return {
      success: true,
      documentId: response.data.documentId,
      message: "Resume successfully uploaded in JobDiva",
    };
  } catch (error) {
    logger.error(`Error uploading resume to JobDiva: ${error.message}`);

    // Provide more detailed error information if available from the API
    if (error.response) {
      logger.error("JobDiva API error details:", {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
      });
    }

    return {
      success: false,
      error: `Failed to upload resume: ${error.message}`,
    };
  }
};

export default {
  pushCandidateToJobDiva,
  pullCandidatesFromJobDiva,
  updateCandidateInJobDiva,
  uploadCandidateResume,
};
