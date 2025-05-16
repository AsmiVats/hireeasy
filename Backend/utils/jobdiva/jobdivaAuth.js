/**
 * JobDiva API Authentication Utility
 * Documentation: https://api.jobdiva.com/jobdiva-api.html
 */

import axios from "axios";
import dotenv from "dotenv";
import logger from "../logger.js";

dotenv.config();

// JobDiva API base URL
const JOBDIVA_API_BASE_URL =
  process.env.JOBDIVA_API_BASE_URL || "https://api.jobdiva.com/apiv2";
const JOBDIVA_CLIENT_ID = process.env.JOBDIVA_CLIENT_ID;
const JOBDIVA_USERNAME = process.env.JOBDIVA_USERNAME;
const JOBDIVA_PASSWORD = process.env.JOBDIVA_PASSWORD;
// const ENABLE_JOBDIVA_INTEGRATION =
//   process.env.ENABLE_JOBDIVA_INTEGRATION === "true";
const ENABLE_JOBDIVA_INTEGRATION = true;

// Cache for the auth token to avoid requesting it for every API call
let authTokenCache = {
  token: null,
  expiresAt: null,
};

/**
 * Check if JobDiva integration is enabled
 * @returns {boolean} - Whether JobDiva integration is enabled
 */
export const isJobDivaEnabled = () => {
  return ENABLE_JOBDIVA_INTEGRATION === true;
};

/**
 * Get a valid authentication token for JobDiva API
 * @returns {Promise<string>} The authentication token
 * @throws {Error} If JobDiva integration is disabled or authentication fails
 */
export const getJobDivaAuthToken = async () => {
  // Check if JobDiva integration is enabled
  // if (!isJobDivaEnabled()) {
  //   const error = new Error("JobDiva integration is disabled");
  //   logger.warn(
  //     "Attempted to get JobDiva auth token while integration is disabled"
  //   );
  //   throw error;
  // }

  // Check if required credentials are provided
  if (!JOBDIVA_CLIENT_ID || !JOBDIVA_USERNAME || !JOBDIVA_PASSWORD) {
    const error = new Error(
      "JobDiva API credentials are not properly configured"
    );
    logger.error("JobDiva API credentials missing in environment variables");
    throw error;
  }

  // Check if we have a valid cached token
  if (
    authTokenCache.token &&
    authTokenCache.expiresAt &&
    new Date() < authTokenCache.expiresAt
  ) {
    return authTokenCache.token;
  }

  try {
    // Request a new token
    logger.info("Requesting new JobDiva authentication token");
    const url = `${JOBDIVA_API_BASE_URL}/authenticate?clientid=${JOBDIVA_CLIENT_ID}&username=${JOBDIVA_USERNAME}&password=${JOBDIVA_PASSWORD}`;

    const config = {
      method: "get",
      url: url,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await axios(config);

    if (response.data) {
      // Cache the token with expiration time (assuming token is valid for 1 hour)
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);

      authTokenCache = {
        token: response.data.token,
        expiresAt,
      };

      logger.info("Successfully obtained JobDiva authentication token");
      return response.data;
    } else {
      const error = new Error(
        "Failed to retrieve authentication token from JobDiva API"
      );
      logger.error(
        "JobDiva API returned unexpected response format",
        response.data
      );
      throw error;
    }
  } catch (error) {
    logger.error("JobDiva authentication error:", error);
    throw error;
  }
};

/**
 * Create authenticated axios instance for JobDiva API calls
 * @returns {Promise<AxiosInstance>} Axios instance with authentication headers
 * @throws {Error} If JobDiva integration is disabled or authentication fails
 */
export const createJobDivaApiClient = async () => {
  // Check if JobDiva integration is enabled
  // if (!isJobDivaEnabled()) {
  //   const error = new Error("JobDiva integration is disabled here");
  //   logger.warn(
  //     "Attempted to create JobDiva API client while integration is disabled"
  //   );
  //   throw error;
  // }

  const token = await getJobDivaAuthToken();

  return axios.create({
    baseURL: JOBDIVA_API_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export default {
  isJobDivaEnabled,
  getJobDivaAuthToken,
  createJobDivaApiClient,
};
