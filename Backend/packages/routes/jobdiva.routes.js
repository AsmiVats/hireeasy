import express from 'express';
import jobdivaController from '../jobdiva-service/src/jobdiva.controller.js';
import { authenticateJWT } from '../middlewares/auth.middleware.js';
import authService from '../../utils/jobdiva/jobdivaAuth.js';
import logger from '../../utils/logger.js';

const router = express.Router();

// Middleware to ensure JobDiva integration is enabled
const checkJobDivaEnabled = (req, res, next) => {
  if (!authService.isJobDivaEnabled()) {
    logger.warn(`JobDiva API access attempted while integration is disabled: ${req.method} ${req.originalUrl}`);
    return res.status(403).json({
      success: false,
      message: 'JobDiva integration is disabled'
    });
  }
  next();
};

// Middleware to restrict access to local or trusted IPs
const restrictToTrustedIPs = (req, res, next) => {
  // List of trusted IPs (localhost and local network IPs)
  const trustedIPs = ['127.0.0.1', '::1', '::ffff:127.0.0.1', 'localhost'];
  
  // Get the client IP
  const clientIP = req.ip || 
                  req.connection.remoteAddress || 
                  req.socket.remoteAddress || 
                  req.headers['x-forwarded-for'];
                  
  // Check if the request comes from an internal system
  const isInternal = req.headers['x-internal-request'] === process.env.INTERNAL_API_KEY;
  
  // Allow access if the request comes from a trusted IP or has the internal header
  if (trustedIPs.includes(clientIP) || isInternal) {
    return next();
  }
  
  // Log and deny the request
  logger.warn(`Unauthorized access attempt to JobDiva API from IP: ${clientIP}`);
  return res.status(403).json({
    success: false,
    message: 'Access to JobDiva API is restricted'
  });
};

// Apply middleware to all routes
router.use(authenticateJWT);
router.use(checkJobDivaEnabled);
router.use(restrictToTrustedIPs);

// Job routes
router.post('/jobs', jobdivaController.pushJob);
router.get('/jobs', jobdivaController.pullJobs);
router.put('/jobs/:jobDivaId', jobdivaController.updateJob);

// Candidate routes
router.post('/candidates', jobdivaController.pushCandidate);
router.get('/candidates', jobdivaController.pullCandidates);
router.put('/candidates/:jobDivaId', jobdivaController.updateCandidate);
router.post(
  '/candidates/:jobDivaId/resume',
  jobdivaController.upload.single('resume'),
  jobdivaController.uploadResume
);

// Sync routes
router.post('/sync/jobs-to-jobdiva', jobdivaController.syncJobsToJobDiva);
router.post('/sync/candidates-to-jobdiva', jobdivaController.syncCandidatesToJobDiva);
router.post('/sync/jobs-from-jobdiva', jobdivaController.syncJobsFromJobDiva);
router.post('/sync/candidates-from-jobdiva', jobdivaController.syncCandidatesFromJobDiva);

export default router; 