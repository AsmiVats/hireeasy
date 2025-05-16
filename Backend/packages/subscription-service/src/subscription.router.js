import express from 'express';
import { authenticateJWT } from '../../middlewares/auth.middleware.js';
import subscriptionStripeController from './subcriptionStripe.controller.js';
import mongoose from 'mongoose';

const router = express.Router();
const User = mongoose.model('User');

// Get user subscription
router.get('/user/:userId', authenticateJWT, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Verify user has access to this data
    if (req.user.id !== userId && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Unauthorized access to subscription data' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (!user.subscriptionPlan) {
      return res.status(404).json({ message: 'No subscription found for this user' });
    }
    
    // Get plan details from stripe
    const plan = await subscriptionStripeController.getSubscriptionPlanById(user.subscriptionPlan);
    
    // Return subscription data formatted for the frontend
    const subscription = {
      planId: user.subscriptionPlan,
      planName: plan?.name || 'Unknown Plan',
      expiryDate: user.subscriptionExpiry,
      features: {
        resumeViews: {
          limit: plan?.resumeViewLimit || 0,
          used: user.resumeDownloadCount || 0
        },
        jobPosting: {
          limit: plan?.jobPostLimit || 0,
          used: user.jobPostCount || 0
        }
      }
    };
    
    return res.status(200).json(subscription);
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Handle direct resume download requests with URL
router.get('/download-resume', authenticateJWT, async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ message: 'Resume URL is required' });
    }

    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user has an active subscription
    if (!user.subscriptionPlan || !user.subscriptionExpiry || new Date(user.subscriptionExpiry) < new Date()) {
      return res.status(403).json({ message: 'Active subscription required to download resumes' });
    }
    
    // Get plan details to check limits
    const plan = await subscriptionStripeController.getSubscriptionPlanById(user.subscriptionPlan);
    
    // Check if user has reached the resume view limit
    if (user.resumeDownloadCount >= (plan?.resumeViewLimit || 0)) {
      return res.status(403).json({ message: 'Resume view limit reached. Please upgrade your subscription.' });
    }
    
    // Increment resume download count
    user.resumeDownloadCount = (user.resumeDownloadCount || 0) + 1;
    await user.save();
    
    // Return success with the download URL
    // In a real implementation, you might want to generate a signed URL or proxy the download
    return res.status(200).json({ 
      success: true,
      downloadUrl: url,
      resumeDownloadCount: user.resumeDownloadCount,
      limit: plan?.resumeViewLimit || 0
    });
  } catch (error) {
    console.error('Error processing resume download:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Handle candidate resume access
router.get('/candidate-resume/:candidateId', authenticateJWT, async (req, res) => {
  try {
    const { candidateId } = req.params;
    if (!candidateId) {
      return res.status(400).json({ message: 'Candidate ID is required' });
    }

    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user has an active subscription
    if (!user.subscriptionPlan || !user.subscriptionExpiry || new Date(user.subscriptionExpiry) < new Date()) {
      return res.status(403).json({ message: 'Active subscription required to view candidate resumes' });
    }
    
    // Get plan details to check limits
    const plan = await subscriptionStripeController.getSubscriptionPlanById(user.subscriptionPlan);
    
    // Check if user has reached the resume view limit
    if (user.resumeDownloadCount >= (plan?.resumeViewLimit || 0)) {
      return res.status(403).json({ message: 'Resume view limit reached. Please upgrade your subscription.' });
    }
    
    // TODO: Fetch candidate resume details from your database
    // const candidate = await Candidate.findById(candidateId);
    // const resumeUrl = candidate?.resumeUrl;
    
    // For now, increment the counter and return a success message
    user.resumeDownloadCount = (user.resumeDownloadCount || 0) + 1;
    await user.save();
    
    // Return the candidate resume details
    // In a real implementation, you would return actual candidate data
    return res.status(200).json({ 
      success: true,
      // downloadUrl: resumeUrl, // Uncomment and use when you have actual candidate data
      resumeDownloadCount: user.resumeDownloadCount,
      limit: plan?.resumeViewLimit || 0
    });
  } catch (error) {
    console.error('Error accessing candidate resume:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Update job post count
router.put('/users/:userId/job-post-count', authenticateJWT, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Verify user has access to update this data
    if (req.user.id !== userId && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user has an active subscription
    if (!user.subscriptionPlan || !user.subscriptionExpiry || new Date(user.subscriptionExpiry) < new Date()) {
      return res.status(403).json({ message: 'No active subscription' });
    }
    
    // Get plan details to check limits
    const plan = await subscriptionStripeController.getSubscriptionPlanById(user.subscriptionPlan);
    
    // Check if user has reached the job posting limit
    if (user.jobPostCount >= (plan?.jobPostLimit || 0)) {
      return res.status(403).json({ message: 'Job posting limit reached' });
    }
    
    // Increment job post count
    user.jobPostCount = (user.jobPostCount || 0) + 1;
    await user.save();
    
    return res.status(200).json({ 
      jobPostCount: user.jobPostCount,
      limit: plan?.jobPostLimit || 0
    });
  } catch (error) {
    console.error('Error updating job post count:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Update resume download count
router.put('/users/:userId/resume-view-count', authenticateJWT, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Verify user has access to update this data
    if (req.user.id !== userId && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user has an active subscription
    if (!user.subscriptionPlan || !user.subscriptionExpiry || new Date(user.subscriptionExpiry) < new Date()) {
      return res.status(403).json({ message: 'No active subscription' });
    }
    
    // Get plan details to check limits
    const plan = await subscriptionStripeController.getSubscriptionPlanById(user.subscriptionPlan);
    
    // Check if user has reached the resume view limit
    if (user.resumeDownloadCount >= (plan?.resumeViewLimit || 0)) {
      return res.status(403).json({ message: 'Resume view limit reached' });
    }
    
    // Increment resume download count
    user.resumeDownloadCount = (user.resumeDownloadCount || 0) + 1;
    await user.save();
    
    return res.status(200).json({ 
      resumeDownloadCount: user.resumeDownloadCount,
      limit: plan?.resumeViewLimit || 0
    });
  } catch (error) {
    console.error('Error updating resume view count:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Existing routes
router.post('/create-plan', subscriptionStripeController.createSubscriptionPlan);
router.get('/plans/:planId', subscriptionStripeController.getSubscriptionPlan);
router.put('/plans/:planId', subscriptionStripeController.updateSubscriptionPlan);
router.delete('/plans/:planId', subscriptionStripeController.deleteSubscriptionPlan);
router.get('/user-subscription/:userId', subscriptionStripeController.checkUserSubscription);
router.post('/webhook', express.raw({ type: 'application/json' }), subscriptionStripeController.handleWebhook);
router.post('/create-checkout-session', subscriptionStripeController.createCheckoutSession);
router.post('/create-portal-session', subscriptionStripeController.createPortalSession);
router.post('/create-default-prices', subscriptionStripeController.createDefaultPrices);
router.get('/get-prices', subscriptionStripeController.getAllPrices);

export default router; 