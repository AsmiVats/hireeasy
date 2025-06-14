import express from "express";
import { authenticateJWT } from "../middlewares/auth.middleware.js";
import mongoose from "mongoose";
import subscriptionStripeController from "../subscription-service/src/subcriptionStripe.controller.js";

const router = express.Router();
const User = mongoose.model("User");

// Get user by ID
router.get("/:userId", authenticateJWT, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Verify user has access to this data
    if (req.user.id !== userId && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Unauthorized access to user data' });
    }
    
    const user = await User.findById(userId).select('-password'); // Exclude password from response
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Update job post count
router.put("/:userId/job-post-count", authenticateJWT, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Verify user has access to update this data
    if (req.user.id !== userId && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    
    const user = await User.findById(userId);
    console.log(user,"Userrr");
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user has an active subscription
    if (!user.subscription || !user.subscription.expiryDate || new Date(user.subscription.expiryDate) < new Date()) {
      return res.status(403).json({ message: 'No active subscription' });
    }
    
    // Get plan details to check limits
    const plan = await subscriptionStripeController.getSubscriptionPlanById(user.subscription.planId);
    
    // Check if user has reached the job posting limit
    if (user.jobPostCount >= (plan?.jobPostLimit || 0)) {
      return res.status(403).json({ message: 'Job posting limit reached' });
    }
    
    // Increment job post count
    user.jobPostCount = (user.jobPostCount || 0) + 1;
    user.isSubscribed = true;
    user.planName = plan.name;
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

// Update resume view count
router.put("/:userId/resume-view-count", authenticateJWT, async (req, res) => {
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

export default router; 