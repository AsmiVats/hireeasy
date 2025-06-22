/**
 * JobDiva Integration Controller
 * Handles API endpoints for JobDiva integration
 */

import jobSync from './jobSync.js';
import candidateSync from './candidateSync.js';
import logger from '../../../utils/logger.js';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import syncService from './jobdiva.sync.js';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

export const upload = multer({ storage: storage });

/**
 * Push a job to JobDiva
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const pushJob = async (req, res) => {
  try {
    const jobData = req.body;
    
    if (!jobData) {
      return res.status(400).json({ success: false, message: 'Job data is required' });
    }
    
    logger.info('Pushing job to JobDiva:', { jobTitle: jobData.jobTitle });
    const result = await jobSync.pushJobToJobDiva(jobData);
    
    if (result.success) {
      // Store the JobDiva ID in the database for future reference
      // This would typically update your job model with the external ID
      
      return res.status(200).json({
        success: true,
        message: 'Job successfully pushed to JobDiva',
        jobDivaId: result.jobDivaId
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Failed to push job to JobDiva',
        error: result.error
      });
    }
  } catch (error) {
    logger.error('Error in pushJob controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Pull jobs from JobDiva
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const pullJobs = async (req, res) => {
  try {
    const filters = req.query;
    
    logger.info('Pulling jobs from JobDiva with filters:', filters);
    const result = await jobSync.pullJobsFromJobDiva(filters);
    
    if (result.success) {
      return res.status(200).json({
        success: true,
        message: 'Jobs successfully pulled from JobDiva',
        jobs: result.jobs
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Failed to pull jobs from JobDiva',
        error: result.error
      });
    }
  } catch (error) {
    logger.error('Error in pullJobs controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Update a job in JobDiva
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateJob = async (req, res) => {
  try {
    const { jobDivaId } = req.params;
    const jobData = req.body;
    
    if (!jobDivaId || !jobData) {
      return res.status(400).json({
        success: false, 
        message: 'Job ID and job data are required'
      });
    }
    
    logger.info(`Updating job in JobDiva with ID: ${jobDivaId}`);
    const result = await jobSync.updateJobInJobDiva(jobDivaId, jobData);
    
    if (result.success) {
      return res.status(200).json({
        success: true,
        message: 'Job successfully updated in JobDiva'
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Failed to update job in JobDiva',
        error: result.error
      });
    }
  } catch (error) {
    logger.error('Error in updateJob controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Push a candidate to JobDiva
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const pushCandidate = async (req, res) => {
  try {
    const candidateData = req.body;
    
    if (!candidateData) {
      return res.status(400).json({ success: false, message: 'Candidate data is required' });
    }
    
    logger.info('Pushing candidate to JobDiva:', { candidate: candidateData.name });
    const result = await candidateSync.pushCandidateToJobDiva(candidateData);
    
    if (result.success) {
      // Store the JobDiva ID in the database for future reference
      // This would typically update your candidate model with the external ID
      
      return res.status(200).json({
        success: true,
        message: 'Candidate successfully pushed to JobDiva',
        jobDivaId: result.jobDivaId
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Failed to push candidate to JobDiva',
        error: result.error
      });
    }
  } catch (error) {
    logger.error('Error in pushCandidate controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Pull candidates from JobDiva
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const pullCandidates = async (req, res) => {
  try {
    // Extract filter parameters from query string
    const filters = { ...req.query };
    
    // Extract pagination parameters
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '50', 10);
    
    // Remove pagination parameters from filters
    delete filters.page;
    delete filters.limit;
    
    // Define options with pagination
    const options = {
      pagination: { page, limit }
    };
    
    logger.info('Pulling candidates from JobDiva:', { filters, pagination: options.pagination });
    
    // Call the enhanced pullCandidatesFromJobDiva function with filters and options
    const result = await candidateSync.pullCandidatesFromJobDiva(filters, options);
    
    if (result.success) {
      return res.status(200).json({
        success: true,
        message: result.message || 'Candidates successfully pulled from JobDiva',
        candidates: result.candidates,
        pagination: result.pagination
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Failed to pull candidates from JobDiva',
        error: result.error
      });
    }
  } catch (error) {
    logger.error('Error in pullCandidates controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Update a candidate in JobDiva
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateCandidate = async (req, res) => {
  try {
    const { jobDivaId } = req.params;
    const candidateData = req.body;
    
    if (!jobDivaId || !candidateData) {
      return res.status(400).json({
        success: false, 
        message: 'Candidate ID and candidate data are required'
      });
    }
    
    logger.info(`Updating candidate in JobDiva with ID: ${jobDivaId}`);
    const result = await candidateSync.updateCandidateInJobDiva(jobDivaId, candidateData);
    
    if (result.success) {
      return res.status(200).json({
        success: true,
        message: 'Candidate successfully updated in JobDiva'
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Failed to update candidate in JobDiva',
        error: result.error
      });
    }
  } catch (error) {
    logger.error('Error in updateCandidate controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Upload a resume for a candidate in JobDiva
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const uploadResume = async (req, res) => {
  try {
    const { jobDivaId } = req.params;
    
    if (!jobDivaId) {
      return res.status(400).json({
        success: false, 
        message: 'JobDiva candidate ID is required'
      });
    }
    
    if (!req.file) {
      return res.status(400).json({
        success: false, 
        message: 'Resume file is required'
      });
    }
    
    logger.info(`Uploading resume for candidate with JobDiva ID: ${jobDivaId}`);
    
    // Read the uploaded file
    const resumeBuffer = fs.readFileSync(req.file.path);
    const fileName = req.file.originalname;
    
    // Call our resume upload function
    const result = await candidateSync.uploadCandidateResume(jobDivaId, resumeBuffer, fileName);
    
    // Delete the temporary file
    fs.unlinkSync(req.file.path);
    
    if (result.success) {
      return res.status(200).json({
        success: true,
        message: 'Resume successfully uploaded to JobDiva',
        documentId: result.documentId
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Failed to upload resume to JobDiva',
        error: result.error
      });
    }
  } catch (error) {
    logger.error('Error in uploadResume controller:', error);
    
    // Clean up the temporary file if it exists
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        logger.error('Error deleting temporary resume file:', unlinkError);
      }
    }
    
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Manually trigger sync of jobs from NowEdge to JobDiva
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const syncJobsToJobDiva = async (req, res) => {
  try {
    logger.info('Manually triggering sync of jobs from NowEdge to JobDiva');
    const result = await syncService.syncJobsToJobDiva();
    
    return res.status(200).json({
      success: true,
      message: 'Jobs successfully synced to JobDiva',
      stats: {
        total: result.total,
        success: result.success,
        failed: result.failed
      }
    });
  } catch (error) {
    logger.error('Error in syncJobsToJobDiva controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to sync jobs to JobDiva',
      error: error.message
    });
  }
};

/**
 * Manually trigger sync of candidates from NowEdge to JobDiva
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const syncCandidatesToJobDiva = async (req, res) => {
  try {
    logger.info('Manually triggering sync of candidates from NowEdge to JobDiva');
    const result = await syncService.syncCandidatesToJobDiva();
    
    return res.status(200).json({
      success: true,
      message: 'Candidates successfully synced to JobDiva',
      stats: {
        total: result.total,
        success: result.success,
        failed: result.failed
      }
    });
  } catch (error) {
    logger.error('Error in syncCandidatesToJobDiva controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to sync candidates to JobDiva',
      error: error.message
    });
  }
};

/**
 * Manually trigger sync of jobs from JobDiva to NowEdge
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const syncJobsFromJobDiva = async (req, res) => {
  try {
    logger.info('Manually triggering sync of jobs from JobDiva to NowEdge');
    const result = await syncService.syncJobsFromJobDiva();
    
    return res.status(200).json({
      success: true,
      message: 'Jobs successfully synced from JobDiva',
      stats: {
        total: result.total,
        created: result.created,
        updated: result.updated,
        failed: result.failed
      }
    });
  } catch (error) {
    logger.error('Error in syncJobsFromJobDiva controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to sync jobs from JobDiva',
      error: error.message
    });
  }
};

/**
 * Manually trigger sync of candidates from JobDiva to NowEdge
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const syncCandidatesFromJobDiva = async (req, res) => {
  try {
    logger.info('Manually triggering sync of candidates from JobDiva to NowEdge');
    const result = await syncService.syncCandidatesFromJobDiva();
    
    return res.status(200).json({
      success: true,
      message: 'Candidates successfully synced from JobDiva',
      stats: {
        total: result.total,
        created: result.created,
        updated: result.updated,
        failed: result.failed
      }
    });
  } catch (error) {
    logger.error('Error in syncCandidatesFromJobDiva controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to sync candidates from JobDiva',
      error: error.message
    });
  }
};

export default {
  upload,
  pushJob,
  pullJobs,
  updateJob,
  pushCandidate,
  pullCandidates,
  updateCandidate,
  uploadResume,
  syncJobsToJobDiva,
  syncCandidatesToJobDiva,
  syncJobsFromJobDiva,
  syncCandidatesFromJobDiva
}; 