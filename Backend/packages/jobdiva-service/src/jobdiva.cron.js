/**
 * JobDiva Synchronization Cron Jobs
 * Handles scheduled synchronization between NowEdge and JobDiva
 */

import cron from 'node-cron';
import syncService from './jobdiva.sync.js';
import logger from '../../../utils/logger.js';
import authService from '../../../utils/jobdiva/jobdivaAuth.js';

// Environment configuration
const ENABLE_JOBDIVA_SYNC = process.env.ENABLE_JOBDIVA_SYNC === 'true';

/**
 * Initialize cron jobs for JobDiva synchronization
 */
export const initJobDivaSyncJobs = () => {
  // Check if both integration and sync are enabled
  if (!authService.isJobDivaEnabled() || !ENABLE_JOBDIVA_SYNC) {
    logger.info('JobDiva synchronization cron jobs not initialized: integration or sync is disabled');
    return;
  }
  
  logger.info('Initializing JobDiva synchronization cron jobs');
  
  // Schedule job to sync jobs from NowEdge to JobDiva every 2 hours
  cron.schedule('0 */2 * * *', async () => {
    try {
      // Double-check integration is still enabled before running job
      if (!authService.isJobDivaEnabled()) {
        logger.info('Skipping scheduled job sync to JobDiva: integration is disabled');
        return;
      }
      
      logger.info('Running scheduled sync of jobs from NowEdge to JobDiva');
      const result = await syncService.syncJobsToJobDiva();
      logger.info(`Scheduled sync completed: ${result.success} succeeded, ${result.failed} failed`);
    } catch (error) {
      logger.error(`Error in scheduled job sync to JobDiva: ${error.message}`);
    }
  });

  // Schedule job to sync candidates from NowEdge to JobDiva every 3 hours
  cron.schedule('0 */3 * * *', async () => {
    try {
      // Double-check integration is still enabled before running job
      if (!authService.isJobDivaEnabled()) {
        logger.info('Skipping scheduled candidate sync to JobDiva: integration is disabled');
        return;
      }
      
      logger.info('Running scheduled sync of candidates from NowEdge to JobDiva');
      const result = await syncService.syncCandidatesToJobDiva();
      logger.info(`Scheduled sync completed: ${result.success} succeeded, ${result.failed} failed`);
    } catch (error) {
      logger.error(`Error in scheduled candidate sync to JobDiva: ${error.message}`);
    }
  });

  // Schedule job to sync jobs from JobDiva to NowEdge every day at 1 AM
  cron.schedule('0 1 * * *', async () => {
    try {
      // Double-check integration is still enabled before running job
      if (!authService.isJobDivaEnabled()) {
        logger.info('Skipping scheduled job sync from JobDiva: integration is disabled');
        return;
      }
      
      logger.info('Running scheduled sync of jobs from JobDiva to NowEdge');
      const result = await syncService.syncJobsFromJobDiva();
      logger.info(`Scheduled sync completed: ${result.created} created, ${result.updated} updated, ${result.failed} failed`);
    } catch (error) {
      logger.error(`Error in scheduled job sync from JobDiva: ${error.message}`);
    }
  });

  // Schedule job to sync candidates from JobDiva to NowEdge every day at 2 AM
  cron.schedule('0 2 * * *', async () => {
    try {
      // Double-check integration is still enabled before running job
      if (!authService.isJobDivaEnabled()) {
        logger.info('Skipping scheduled candidate sync from JobDiva: integration is disabled');
        return;
      }
      
      logger.info('Running scheduled sync of candidates from JobDiva to NowEdge');
      const result = await syncService.syncCandidatesFromJobDiva();
      logger.info(`Scheduled sync completed: ${result.created} created, ${result.updated} updated, ${result.failed} failed`);
    } catch (error) {
      logger.error(`Error in scheduled candidate sync from JobDiva: ${error.message}`);
    }
  });

  logger.info('JobDiva synchronization cron jobs initialized');
}; 