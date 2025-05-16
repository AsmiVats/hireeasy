/**
 * JobDiva Synchronization Service
 * Handles scheduled synchronization between NowEdge and JobDiva
 */

import jobSync from './jobSync.js';
import candidateSync from './candidateSync.js';
import { Job } from '../../employer-service/src/employerController.js';
import { CandidateProfile } from '../../jobseeker-service/src/jobseekerController.js';
import logger from '../../../utils/logger.js';

/**
 * Sync all jobs from NowEdge to JobDiva
 * @returns {Promise<Object>} - Result of the sync operation
 */
export const syncJobsToJobDiva = async () => {
  try {
    logger.info('Starting sync of jobs from NowEdge to JobDiva');
    
    // Get all jobs that need to be synced (new or updated)
    // For simplicity, we're limiting to 50 jobs at a time
    const jobs = await Job.find({
      $or: [
        // Jobs that haven't been synced yet
        { externalId: { $exists: false } },
        // Jobs that were modified after being synced (compare timestamps)
        { 
          externalId: { $exists: true },
          updatedAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
        }
      ]
    }).limit(50);
    
    logger.info(`Found ${jobs.length} jobs to sync to JobDiva`);
    
    const results = {
      total: jobs.length,
      success: 0,
      failed: 0,
      details: []
    };
    
    // Process each job
    for (const job of jobs) {
      try {
        // If job already has an externalId, update it in JobDiva
        if (job.externalId && job.externalSource === 'JobDiva') {
          const result = await jobSync.updateJobInJobDiva(job.externalId, job);
          
          if (result.success) {
            results.success++;
            results.details.push({
              jobId: job._id,
              operation: 'update',
              success: true
            });
            logger.info(`Successfully updated job ${job._id} in JobDiva`);
          } else {
            results.failed++;
            results.details.push({
              jobId: job._id,
              operation: 'update',
              success: false,
              error: result.error
            });
            logger.error(`Failed to update job ${job._id} in JobDiva: ${result.error}`);
          }
        } 
        // If job doesn't have an externalId, create it in JobDiva
        else {
          const result = await jobSync.pushJobToJobDiva(job);
          
          if (result.success) {
            // Update the job with the JobDiva ID
            job.externalId = result.jobDivaId;
            job.externalSource = 'JobDiva';
            await job.save();
            
            results.success++;
            results.details.push({
              jobId: job._id,
              operation: 'create',
              success: true,
              jobDivaId: result.jobDivaId
            });
            logger.info(`Successfully created job ${job._id} in JobDiva with ID ${result.jobDivaId}`);
          } else {
            results.failed++;
            results.details.push({
              jobId: job._id,
              operation: 'create',
              success: false,
              error: result.error
            });
            logger.error(`Failed to create job ${job._id} in JobDiva: ${result.error}`);
          }
        }
      } catch (error) {
        results.failed++;
        results.details.push({
          jobId: job._id,
          success: false,
          error: error.message
        });
        logger.error(`Error processing job ${job._id}: ${error.message}`);
      }
    }
    
    logger.info(`Completed sync of jobs to JobDiva: ${results.success} succeeded, ${results.failed} failed`);
    return results;
  } catch (error) {
    logger.error(`Error in syncJobsToJobDiva: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Sync all candidates from NowEdge to JobDiva
 * @returns {Promise<Object>} - Result of the sync operation
 */
export const syncCandidatesToJobDiva = async () => {
  try {
    logger.info('Starting sync of candidates from NowEdge to JobDiva');
    
    // Get all candidates that need to be synced (new or updated)
    // For simplicity, we're limiting to 50 candidates at a time
    const candidates = await CandidateProfile.find({
      $or: [
        // Candidates that haven't been synced yet
        { externalId: { $exists: false } },
        // Candidates that were modified after being synced (compare timestamps)
        { 
          externalId: { $exists: true },
          updatedAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
        }
      ]
    }).limit(50);
    
    logger.info(`Found ${candidates.length} candidates to sync to JobDiva`);
    
    const results = {
      total: candidates.length,
      success: 0,
      failed: 0,
      details: []
    };
    
    // Process each candidate
    for (const candidate of candidates) {
      try {
        // If candidate already has an externalId, update it in JobDiva
        if (candidate.externalId && candidate.externalSource === 'JobDiva') {
          const result = await candidateSync.updateCandidateInJobDiva(candidate.externalId, candidate);
          
          if (result.success) {
            results.success++;
            results.details.push({
              candidateId: candidate._id,
              operation: 'update',
              success: true
            });
            logger.info(`Successfully updated candidate ${candidate._id} in JobDiva`);
          } else {
            results.failed++;
            results.details.push({
              candidateId: candidate._id,
              operation: 'update',
              success: false,
              error: result.error
            });
            logger.error(`Failed to update candidate ${candidate._id} in JobDiva: ${result.error}`);
          }
        } 
        // If candidate doesn't have an externalId, create it in JobDiva
        else {
          const result = await candidateSync.pushCandidateToJobDiva(candidate);
          
          if (result.success) {
            // Update the candidate with the JobDiva ID
            candidate.externalId = result.jobDivaId;
            candidate.externalSource = 'JobDiva';
            await candidate.save();
            
            results.success++;
            results.details.push({
              candidateId: candidate._id,
              operation: 'create',
              success: true,
              jobDivaId: result.jobDivaId
            });
            logger.info(`Successfully created candidate ${candidate._id} in JobDiva with ID ${result.jobDivaId}`);
            
            // If there's a resume link, try to upload it to JobDiva as well
            if (candidate.resumeLink) {
              try {
                const axios = await import('axios');
                
                // Fetch the resume file
                const response = await axios.default.get(candidate.resumeLink, { responseType: 'arraybuffer' });
                const resumeBuffer = Buffer.from(response.data);
                
                // Extract filename from the URL
                const urlParts = candidate.resumeLink.split('/');
                const fileName = urlParts[urlParts.length - 1] || 'resume.pdf';
                
                // Upload the resume to JobDiva
                const resumeResult = await candidateSync.uploadCandidateResume(
                  result.jobDivaId,
                  resumeBuffer,
                  fileName
                );
                
                if (resumeResult.success) {
                  logger.info(`Successfully uploaded resume for candidate ${candidate._id} in JobDiva`);
                } else {
                  logger.error(`Failed to upload resume for candidate ${candidate._id} in JobDiva: ${resumeResult.error}`);
                }
              } catch (resumeError) {
                logger.error(`Error uploading resume for candidate ${candidate._id} to JobDiva: ${resumeError.message}`);
              }
            }
          } else {
            results.failed++;
            results.details.push({
              candidateId: candidate._id,
              operation: 'create',
              success: false,
              error: result.error
            });
            logger.error(`Failed to create candidate ${candidate._id} in JobDiva: ${result.error}`);
          }
        }
      } catch (error) {
        results.failed++;
        results.details.push({
          candidateId: candidate._id,
          success: false,
          error: error.message
        });
        logger.error(`Error processing candidate ${candidate._id}: ${error.message}`);
      }
    }
    
    logger.info(`Completed sync of candidates to JobDiva: ${results.success} succeeded, ${results.failed} failed`);
    return results;
  } catch (error) {
    logger.error(`Error in syncCandidatesToJobDiva: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Pull jobs from JobDiva and sync to NowEdge
 * @returns {Promise<Object>} - Result of the sync operation
 */
export const syncJobsFromJobDiva = async () => {
  try {
    logger.info('Starting sync of jobs from JobDiva to NowEdge');
    
    // Pull jobs from JobDiva
    // You can add filters if needed
    const jobDivaResult = await jobSync.pullJobsFromJobDiva({
      // Optional filters like date range, job status, etc.
      // Example: updatedSince: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
    });
    
    if (!jobDivaResult.success) {
      throw new Error(`Failed to pull jobs from JobDiva: ${jobDivaResult.error}`);
    }
    
    logger.info(`Retrieved ${jobDivaResult.jobs.length} jobs from JobDiva`);
    
    const results = {
      total: jobDivaResult.jobs.length,
      created: 0,
      updated: 0,
      failed: 0,
      details: []
    };
    
    // Process each job
    for (const jobDivaJob of jobDivaResult.jobs) {
      try {
        // Check if we already have this job in our system
        const existingJob = await Job.findOne({
          externalId: jobDivaJob.externalId,
          externalSource: 'JobDiva'
        });
        
        if (existingJob) {
          // Update existing job
          Object.assign(existingJob, jobDivaJob);
          await existingJob.save();
          
          results.updated++;
          results.details.push({
            jobId: existingJob._id,
            jobDivaId: jobDivaJob.externalId,
            operation: 'update',
            success: true
          });
          logger.info(`Updated existing job ${existingJob._id} from JobDiva`);
        } else {
          // Create new job
          const newJob = new Job(jobDivaJob);
          await newJob.save();
          
          results.created++;
          results.details.push({
            jobId: newJob._id,
            jobDivaId: jobDivaJob.externalId,
            operation: 'create',
            success: true
          });
          logger.info(`Created new job ${newJob._id} from JobDiva`);
        }
      } catch (error) {
        results.failed++;
        results.details.push({
          jobDivaId: jobDivaJob.externalId,
          success: false,
          error: error.message
        });
        logger.error(`Error processing JobDiva job ${jobDivaJob.externalId}: ${error.message}`);
      }
    }
    
    logger.info(`Completed sync of jobs from JobDiva: ${results.created} created, ${results.updated} updated, ${results.failed} failed`);
    return results;
  } catch (error) {
    logger.error(`Error in syncJobsFromJobDiva: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Pull candidates from JobDiva and sync to NowEdge
 * @returns {Promise<Object>} - Result of the sync operation
 */
export const syncCandidatesFromJobDiva = async () => {
  try {
    logger.info('Starting sync of candidates from JobDiva to NowEdge');
    
    // Pull candidates from JobDiva
    // You can add filters if needed
    const jobDivaResult = await candidateSync.pullCandidatesFromJobDiva({
      // Optional filters like date range, etc.
      // Example: updatedSince: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
    });
    
    if (!jobDivaResult.success) {
      throw new Error(`Failed to pull candidates from JobDiva: ${jobDivaResult.error}`);
    }
    
    logger.info(`Retrieved ${jobDivaResult.candidates.length} candidates from JobDiva`);
    
    const results = {
      total: jobDivaResult.candidates.length,
      created: 0,
      updated: 0,
      failed: 0,
      details: []
    };
    
    // Process each candidate
    for (const jobDivaCandidate of jobDivaResult.candidates) {
      try {
        // Check if we already have this candidate in our system
        const existingCandidate = await CandidateProfile.findOne({
          externalId: jobDivaCandidate.externalId,
          externalSource: 'JobDiva'
        });
        
        if (existingCandidate) {
          // Update existing candidate
          Object.assign(existingCandidate, jobDivaCandidate);
          await existingCandidate.save();
          
          results.updated++;
          results.details.push({
            candidateId: existingCandidate._id,
            jobDivaId: jobDivaCandidate.externalId,
            operation: 'update',
            success: true
          });
          logger.info(`Updated existing candidate ${existingCandidate._id} from JobDiva`);
        } else {
          // Create new candidate with a temporary password (should be changed on first login)
          const newCandidate = new CandidateProfile({
            ...jobDivaCandidate,
            password: await generateTemporaryPassword(jobDivaCandidate.email)
          });
          await newCandidate.save();
          
          results.created++;
          results.details.push({
            candidateId: newCandidate._id,
            jobDivaId: jobDivaCandidate.externalId,
            operation: 'create',
            success: true
          });
          logger.info(`Created new candidate ${newCandidate._id} from JobDiva`);
        }
      } catch (error) {
        results.failed++;
        results.details.push({
          jobDivaId: jobDivaCandidate.externalId,
          success: false,
          error: error.message
        });
        logger.error(`Error processing JobDiva candidate ${jobDivaCandidate.externalId}: ${error.message}`);
      }
    }
    
    logger.info(`Completed sync of candidates from JobDiva: ${results.created} created, ${results.updated} updated, ${results.failed} failed`);
    return results;
  } catch (error) {
    logger.error(`Error in syncCandidatesFromJobDiva: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Generate a temporary password for a new candidate
 * @param {string} email - Candidate's email
 * @returns {Promise<string>} - Hashed password
 */
const generateTemporaryPassword = async (email) => {
  const bcrypt = await import('bcrypt');
  // Generate a random temporary password
  const temporaryPassword = Math.random().toString(36).slice(-8);
  // Hash it for storage
  return await bcrypt.hash(temporaryPassword, 10);
};

export default {
  syncJobsToJobDiva,
  syncCandidatesToJobDiva,
  syncJobsFromJobDiva,
  syncCandidatesFromJobDiva
}; 