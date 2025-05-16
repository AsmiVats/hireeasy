import express from "express";
import {
  createPlan,
  getPlans,
  updatePlan,
} from "../subscription-service/src/subscription.controller.js";
import SubscriptionController from '../subscription-service/src/subscription.controller.js';
import { authenticateJWT } from '../middlewares/auth.middleware.js';
import { getResumeLink } from "../employer-service/src/employerController.js";
import mongoose from 'mongoose';
import SubscriptionStripeController from '../subscription-service/src/subcriptionStripe.controller.js';
import logger from '../../utils/logger.js';

const router = express.Router();

router.post("/addSubscriptionPlan", createPlan);
router.get("/getSubscriptionPlan", getPlans);
router.put("/updateSubscriptionPlan/:id", updatePlan);

// Get subscription details for a user
router.get('/user/:userId', authenticateJWT, SubscriptionController.getUserSubscription);

// Create or update a subscription for a user
router.post('/user/:userId', authenticateJWT, SubscriptionController.createOrUpdateSubscription);

// Get available subscription plans
router.get('/plans', SubscriptionController.getSubscriptionPlans);

// Get a specific subscription plan
router.get('/plans/:planId', SubscriptionController.getSubscriptionPlan);

// Activate subscription after payment
router.post('/activate', authenticateJWT, SubscriptionController.activateSubscription);

// Cancel a subscription
router.post('/cancel/:subscriptionId', authenticateJWT, SubscriptionController.cancelSubscription);

// Resume a canceled subscription
router.post('/resume/:subscriptionId', authenticateJWT, SubscriptionController.resumeSubscription);

// Debug endpoint to check subscription data
router.get('/debug/:userId', authenticateJWT, async (req, res) => {
  try {
    const { userId } = req.params;
    const User = mongoose.model('User');
    
    logger.api(`Getting debug information for user ID: ${userId}`);
    
    // Find user by ID 
    const user = await User.findById(userId);
    if (!user) {
      logger.warning(`User not found with ID: ${userId} in debug endpoint`);
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get subscription data in various formats
    const debug = {
      raw: {
        user: {
          _id: user._id,
          subscriptionPlan: user.subscriptionPlan,
          subscriptionId: user.subscriptionId,
          subscriptionExpiry: user.subscriptionExpiry,
          subscription: user.subscription,
        }
      },
      subscription: user.subscription,
      recommendations: []
    };
    
    // Add recommendations if issues found
    if (!user.subscription) {
      logger.warning(`No structured subscription found for user: ${userId} in debug endpoint`);
      debug.recommendations.push('No structured subscription object found. Create one from legacy fields.');
    } else {
      if (!user.subscription.planName) {
        logger.warning(`Missing planName in subscription for user: ${userId} in debug endpoint`);
        debug.recommendations.push('Missing planName in subscription. Try deriving from planId.');
      }
      
      if (!user.subscription.planId) {
        logger.warning(`Missing planId in subscription for user: ${userId} in debug endpoint`);
        debug.recommendations.push('Missing planId in subscription. Try deriving from legacy fields.');
      }
      
      if (!user.subscription.features) {
        logger.warning(`Missing features in subscription for user: ${userId} in debug endpoint`);
        debug.recommendations.push('Missing features in subscription. Initialize with defaults.');
      } else {
        if (!user.subscription.features.resumeViews) {
          logger.warning(`Missing resumeViews in features for user: ${userId} in debug endpoint`);
          debug.recommendations.push('Missing resumeViews in features. Initialize with defaults.');
        }
        
        if (!user.subscription.features.jobPosting) {
          logger.warning(`Missing jobPosting in features for user: ${userId} in debug endpoint`);
          debug.recommendations.push('Missing jobPosting in features. Initialize with defaults.');
        }
      }
    }
    
    logger.success(`Debug information generated for user: ${userId}`);
    return res.status(200).json(debug);
  } catch (error) {
    logger.error('Debug endpoint error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Resume download endpoints
router.get("/download-resume", authenticateJWT, async (req, res) => {
  // Forward to getResumeLink with the authenticated user's ID
  req.query.employerId = req.user._id;
  return getResumeLink(req, res);
});

router.get("/candidate-resume/:candidateId", authenticateJWT, async (req, res) => {
  // Forward to getResumeLink with the authenticated user's ID and the requested candidate ID
  req.query.employerId = req.user._id;
  req.query.candidateId = req.params.candidateId;
  return getResumeLink(req, res);
});

export default router;
