import mongoose from "mongoose";
import stripePackage from 'stripe';
import { getSubscriptionPlanById } from '../../utils/stripe.helper.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from '../../../utils/logger.js';
import { hireEasyEmails } from "../../../utils/reusableConstants.js";
import { subcriptionSuccessfullToUser } from "../../../utils/emailTemplate/subscriptionSuccessfullToUser.js";
import { subcriptionSuccessfullToHireeast } from "../../../utils/emailTemplate/subscriptionSuccessfullToHireeasy.js";
import { sendMail1 } from "../../../utils/sendMail.js";

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read plans data from JSON file
const plansFilePath = path.join(__dirname, 'plans.json');
const planData = JSON.parse(fs.readFileSync(plansFilePath, 'utf8'));

const PlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    priceInRupees: { type: Number, required: true },
    priceInDollars: { type: Number, required: true },
    validityInDays: { type: Number, required: true },
    resumeViews: { type: Number, required: true },
    jobPostings: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Plan = mongoose.model("Plan", PlanSchema);

export const createPlan = async (req, res) => {
  try {
    const plan = await Plan.create(req.body);
    return res.status(201).json({ success: true, data: plan });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPlans = async (req, res) => {
  try {
    const id = req.query.id;
    let getObj = {};
    if (id) {
      getObj._id = new mongoose.Types.ObjectId(id);
    }
    const plans = await Plan.find(getObj);
    return res.status(200).json({ success: true, data: plans });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!plan)
      return res
        .status(404)
        .json({ success: false, message: "Plan not found" });

    return res.status(200).json({ success: true, data: plan });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);
const User = mongoose.model('User');

class SubscriptionController {
  // Get subscription for a user
  async getUserSubscription(req, res) {
    try {
      const { userId } = req.params;
      logger.api(`Getting subscription for user ID: ${userId}`);
      
      // Find user by ID
      const user = await User.findById(userId);
      if (!user) {
        logger.warning(`User not found with ID: ${userId}`);
        return res.status(404).json({ message: 'User not found' });
      }
      
      logger.info(`Raw user subscription data:`, user.subscription || 'None');
      
      // Create a default subscription object to ensure minimum required fields
      const defaultSubscription = {
        planId: 'basic',
        planName: 'Basic Plan',
        expiryDate: new Date(Date.now() + (365 * 24 * 60 * 60 * 1000)), // Default 1 year expiry
        features: {
          resumeViews: {
            limit: planData.plans.default.resumeViews || 0,
            used: 0
          },
          jobPosting: {
            limit: planData.plans.default.jobPosting || 0,
            used: 0
          }
        }
      };
      
      let modified = false;
      
      // If user doesn't have a structured subscription
      if (!user.subscription) {
        logger.info(`No structured subscription found for user: ${userId}, checking legacy fields`);
        
        // Check for old subscription format and convert if needed
        if (user.subscriptionPlan && user.subscriptionExpiry) {
          logger.info(`Found legacy subscription data for user: ${userId}`, {
            plan: user.subscriptionPlan,
            expiry: user.subscriptionExpiry
          });
          
          // Create a new structured subscription from old format data
          const expiryDate = new Date(user.subscriptionExpiry);
          
          // Determine plan name from subscriptionPlan field
          let planKey = 'default';
          const planIdLower = user.subscriptionPlan?.toLowerCase() || '';
          
          if (planIdLower.includes('bronze')) planKey = 'bronze';
          else if (planIdLower.includes('silver')) planKey = 'silver';
          else if (planIdLower.includes('unlimited')) planKey = 'unlimited';
          
          logger.info(`Derived plan key for user ${userId}: ${planKey}`);
          
          // Get plan name and limits from JSON file
          const planName = planData.plans[planKey].name;
          const resumeViewsLimit = planData.plans[planKey].resumeViews;
          const jobPostingLimit = planData.plans[planKey].jobPosting;
          
          // Create new structured subscription
          user.subscription = {
            planId: user.subscriptionPlan,
            planName: planName,
            expiryDate: expiryDate,
            stripeSubscriptionId: user.subscriptionId || 'unknown',
            features: {
              resumeViews: {
                limit: resumeViewsLimit,
                used: user.resumeDownloadCount || 0
              },
              jobPosting: {
                limit: jobPostingLimit,
                used: user.jobPostCount || 0
              }
            }
          };
          
          logger.success(`Created structured subscription for user: ${userId}`, {
            planName: planName,
            expiryDate: expiryDate,
            resumeViewsLimit: resumeViewsLimit,
            jobPostingLimit: jobPostingLimit
          });
          
          modified = true;
        } else {
          // No legacy subscription data, create default subscription
          logger.warning(`No subscription data found for user: ${userId}, creating default subscription`);
          user.subscription = defaultSubscription;
          modified = true;
        }
      } else {
        // User has subscription object but check if it has required fields
        logger.info(`Validating existing subscription for user: ${userId}`);
        
        // Check if planId is missing
        if (!user.subscription.planId) {
          logger.warning(`Missing planId in subscription for user: ${userId}, adding default value`);
          user.subscription.planId = defaultSubscription.planId;
          modified = true;
        }
        
        // Check if planName is missing
        if (!user.subscription.planName) {
          logger.warning(`Missing planName in subscription for user: ${userId}, deriving from planId`);
          
          // Try to derive planName from planId if available
          if (user.subscription.planId) {
            const planIdLower = user.subscription.planId.toLowerCase();
            
            if (planIdLower.includes('bronze')) {
              user.subscription.planName = 'Bronze Plan';
            } else if (planIdLower.includes('silver')) {
              user.subscription.planName = 'Silver Plan';
            } else if (planIdLower.includes('unlimited')) {
              user.subscription.planName = 'Unlimited Plan';
            } else {
              user.subscription.planName = 'Basic Plan';
            }
            
            logger.info(`Derived plan name from planId: ${user.subscription.planName}`);
          } else {
            // If planId is also missing, use default planName
            user.subscription.planName = defaultSubscription.planName;
            logger.info(`Using default plan name: ${user.subscription.planName}`);
          }
          
          modified = true;
        }
        
        // Check for missing or incomplete features
        if (!user.subscription.features) {
          logger.warning(`Missing features in subscription for user: ${userId}, adding default features`);
          user.subscription.features = defaultSubscription.features;
          modified = true;
        } else {
          // Check for missing resumeViews or jobPosting
          if (!user.subscription.features.resumeViews) {
            logger.warning(`Missing resumeViews in subscription for user: ${userId}, adding default value`);
            user.subscription.features.resumeViews = defaultSubscription.features.resumeViews;
            modified = true;
          }
          
          if (!user.subscription.features.jobPosting) {
            logger.warning(`Missing jobPosting in subscription for user: ${userId}, adding default value`);
            user.subscription.features.jobPosting = defaultSubscription.features.jobPosting;
            modified = true;
          }
        }
      }
      
      // Save updates to the database if any modifications were made
      if (modified) {
        logger.info(`Saving updated subscription for user: ${userId}`, user.subscription);
        // Use findByIdAndUpdate to avoid validation issues with direct save
        await User.findByIdAndUpdate(userId, {
          subscription: user.subscription
        }, { new: true });
      }
      
      logger.success(`Returning subscription for user: ${userId}`, {
        planName: user.subscription.planName,
        planId: user.subscription.planId
      });
      
      return res.status(200).json(user.subscription);
    } catch (error) {
      logger.error(`Error getting user subscription for user: ${req.params.userId}`, error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
  
  // Create or update a subscription for a user
  async createOrUpdateSubscription(req, res) {
    try {
      const { userId } = req.params;
      const { planId, expiryDate, features } = req.body;
      
      // Get plan details
      const plan = await getSubscriptionPlanById(planId);
      if (!plan) {
        return res.status(404).json({ message: 'Plan not found' });
      }
      
      // Find user by ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Create/update subscription
      user.subscription = {
        planId,
        planName: plan.name,
        expiryDate: expiryDate || new Date(Date.now() + (plan.intervalCount * 24 * 60 * 60 * 1000)), // Default to plan interval
        features: {
          resumeViews: {
            limit: plan.resumeViewLimit,
            used: 0
          },
          jobPosting: {
            limit: plan.jobPostLimit,
            used: 0
          }
        }
      };
      
      await user.save();
      const link = `${process.env.FRONTEND_URL}/`
      await sendMail1(hireEasyEmails[0], user.email, 'Your Subscription is Activated', subcriptionSuccessfullToUser(user.name, new Date().toLocaleDateString(), new Date(user.subscription.expiryDate).toLocaleDateString()),link)
      await sendMail1(hireEasyEmails[0], hireEasyEmails[1], 'User activated the subscription', subcriptionSuccessfullToHireeast(user.name, new Date().toLocaleDateString(), new Date(user.subscription.expiryDate).toLocaleDateString(), user.phone),link)
      
      return res.status(200).json(user.subscription);
    } catch (error) {
      console.error('Error creating/updating subscription:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
  
  // Activate a subscription after payment
  async activateSubscription(req, res) {
    try {
      const { sessionId, subscriptionId } = req.body;
      const userId = req.user.id; // Get authenticated user ID
      
      // Validate that we have either sessionId or subscriptionId
      if (!sessionId && !subscriptionId) {
        return res.status(400).json({ 
          message: 'Either sessionId or subscriptionId is required' 
        });
      }
      
      // Find user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      try {
        logger.info(`Activating subscription for user: ${userId}`, {
          sessionId: sessionId || 'Not provided',
          subscriptionId: subscriptionId || 'Not provided'
        });
        
        let subscriptionDetails;
        let planDetails;
        
        // If we have a session ID, retrieve the session
        if (sessionId) {
          const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['subscription', 'subscription.plan.product']
          });
          
          if (!session) {
            throw new Error('Session not found');
          }
          
          subscriptionDetails = session.subscription;
          logger.info(`Retrieved session: ${sessionId}`, {
            subscription: subscriptionDetails ? 'Found' : 'Not found'
          });
        } 
        // If we have a subscription ID, retrieve the subscription
        else if (subscriptionId) {
          subscriptionDetails = await stripe.subscriptions.retrieve(subscriptionId, {
            expand: ['plan.product']
          });
          
          if (!subscriptionDetails) {
            throw new Error('Subscription not found');
          }
          
          logger.info(`Retrieved subscription: ${subscriptionId}`, {
            plan: subscriptionDetails.plan.product.name || 'Unknown plan'
          });
        }
        
        // Extract plan details
        const planId = subscriptionDetails.plan.id;
        const planName = subscriptionDetails.plan.product.name;
        const planInterval = subscriptionDetails.plan.interval;
        const planIntervalCount = subscriptionDetails.plan.interval_count;
        
        logger.info(`Plan details for user ${userId}:`, {
          planId,
          planName,
          planInterval,
          planIntervalCount
        });
        
        // Calculate expiry date
        let intervalMultiplier;
        switch (planInterval) {
          case 'day': intervalMultiplier = 1; break;
          case 'week': intervalMultiplier = 7; break;
          case 'month': intervalMultiplier = 30; break;
          case 'year': intervalMultiplier = 365; break;
          default: intervalMultiplier = 1;
        }
        
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + (intervalMultiplier * planIntervalCount));
        
        // Set feature limits based on product metadata or defaults
        const getDefaultLimitForPlan = this._getDefaultLimitForPlan.bind(this);
        
        const resumeViewLimit = subscriptionDetails.plan.product.metadata?.resume_view_limit || 
          getDefaultLimitForPlan(planName, 'resumeViews');
        
        const jobPostLimit = subscriptionDetails.plan.product.metadata?.job_post_limit || 
          getDefaultLimitForPlan(planName, 'jobPosting');
        
        // Create subscription object
        const subscriptionObject = {
          planId,
          planName,
          expiryDate,
          stripeSubscriptionId: subscriptionDetails.id,
          features: {
            resumeViews: {
              limit: parseInt(resumeViewLimit, 10),
              used: 0
            },
            jobPosting: {
              limit: parseInt(jobPostLimit, 10),
              used: 0
            }
          }
        };
        
        logger.success(`Created subscription object for user ${userId}:`, subscriptionObject);
        
        // Update using findByIdAndUpdate to ensure atomic update
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          { 
            subscription: subscriptionObject,
            // Also update legacy fields for backward compatibility
            subscriptionPlan: planName.replace(' Plan', ''),
            subscriptionId: subscriptionDetails.id,
            subscriptionExpiry: expiryDate
          },
          { new: true }
        );
        
        if (!updatedUser) {
          throw new Error('Failed to update user with subscription data');
        }
        
        logger.success(`Subscription activated for user ${userId}`);
        
        // Calculate discount amount (if any)
        let discount = 0;
        if (subscriptionDetails.discount) {
          discount = Math.round(subscriptionDetails.discount.amount_off / 100);
        }
        
        return res.status(200).json({
          success: true,
          message: 'Subscription activated successfully',
          planName,
          expiryDate,
          discount,
          subscription: subscriptionObject
        });
        
      } catch (stripeError) {
        logger.error('Stripe error:', stripeError);
        return res.status(400).json({ 
          message: 'Error retrieving subscription details', 
          error: stripeError.message 
        });
      }
    } catch (error) {
      logger.error('Error activating subscription:', error);
      return res.status(500).json({ 
        message: 'Server error', 
        error: error.message 
      });
    }
  }
  
  // Helper method to get default limits based on plan name
  _getDefaultLimitForPlan(planName, featureType) {
    const planNameLower = planName?.toLowerCase() || '';
    let planKey = 'default';
    
    // Determine plan key based on name
    if (planNameLower.includes('bronze')) planKey = 'bronze';
    if (planNameLower.includes('silver')) planKey = 'silver';
    if (planNameLower.includes('unlimited')) planKey = 'unlimited';
    
    // Get values from the JSON file
    if (featureType === 'resumeViews') {
      return planData.plans[planKey].resumeViews;
    } 
    
    if (featureType === 'jobPosting') {
      return planData.plans[planKey].jobPosting;
    }
    
    return 0;
  }
  
  // Get available subscription plans
  async getSubscriptionPlans(req, res) {
    try {
      // Fetch plans from Stripe
      const prices = await stripe.prices.list({
        active: true,
        expand: ['data.product']
      });
      
      // Store reference to _getDefaultLimitForPlan function
      const getDefaultLimitForPlan = this._getDefaultLimitForPlan.bind(this);
      
      // Format the response
      const plans = prices.data.map(price => ({
        id: price.id,
        productId: price.product.id,
        name: price.product.name,
        description: price.product.description,
        amount: price.unit_amount / 100, // Convert cents to dollars
        currency: price.currency,
        interval: price.recurring?.interval,
        intervalCount: price.recurring?.interval_count,
        features: {
          resumeViews: price.product.metadata?.resume_view_limit || 
            getDefaultLimitForPlan(price.product.name, 'resumeViews'),
          jobPosting: price.product.metadata?.job_post_limit || 
            getDefaultLimitForPlan(price.product.name, 'jobPosting')
        }
      }));
      
      return res.status(200).json(plans);
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
  
  // Get a specific subscription plan
  async getSubscriptionPlan(req, res) {
    try {
      const { planId } = req.params;
      
      // Get price from Stripe
      const price = await stripe.prices.retrieve(planId, {
        expand: ['product']
      });
      
      if (!price) {
        return res.status(404).json({ message: 'Plan not found' });
      }
      
      // Store reference to _getDefaultLimitForPlan function
      const getDefaultLimitForPlan = this._getDefaultLimitForPlan.bind(this);
      
      // Format the response
      const plan = {
        id: price.id,
        productId: price.product.id,
        name: price.product.name,
        description: price.product.description,
        amount: price.unit_amount / 100, // Convert cents to dollars
        currency: price.currency,
        interval: price.recurring?.interval,
        intervalCount: price.recurring?.interval_count,
        features: {
          resumeViews: price.product.metadata?.resume_view_limit || 
            getDefaultLimitForPlan(price.product.name, 'resumeViews'),
          jobPosting: price.product.metadata?.job_post_limit || 
            getDefaultLimitForPlan(price.product.name, 'jobPosting')
        }
      };
      
      return res.status(200).json(plan);
    } catch (error) {
      console.error('Error fetching subscription plan:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
  
  // Cancel a subscription
  async cancelSubscription(req, res) {
    try {
      const { subscriptionId } = req.params;
      const userId = req.user.id;
      
      // Find user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Check if user has the subscription
      if (!user.subscription || user.subscription.stripeSubscriptionId !== subscriptionId) {
        return res.status(403).json({ message: 'Unauthorized to cancel this subscription' });
      }
      
      // Cancel subscription in Stripe
      const canceledSubscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true
      });
      
      return res.status(200).json({ 
        success: true,
        message: 'Subscription will be canceled at the end of the billing period' 
      });
    } catch (error) {
      console.error('Error canceling subscription:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
  
  // Resume a canceled subscription
  async resumeSubscription(req, res) {
    try {
      const { subscriptionId } = req.params;
      const userId = req.user.id;
      
      // Find user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Check if user has the subscription
      if (!user.subscription || user.subscription.stripeSubscriptionId !== subscriptionId) {
        return res.status(403).json({ message: 'Unauthorized to resume this subscription' });
      }
      
      // Resume subscription in Stripe
      const resumedSubscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: false
      });
      
      return res.status(200).json({ 
        success: true,
        message: 'Subscription resumed successfully' 
      });
    } catch (error) {
      console.error('Error resuming subscription:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
}

export default new SubscriptionController();
