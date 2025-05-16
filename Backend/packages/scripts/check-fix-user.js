import mongoose from 'mongoose';
import { User } from '../auth-service/src/auth.controller.js';

const checkAndFixUser = async (userId) => {
  try {
    // Connect to database
    await mongoose.connect(
      "mongodb+srv://Shreyas4545:sJY755G8Jh4CRoHw@cluster0.eao1l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    
    console.log('Connected to MongoDB');
    
    // Find user by ID
    const user = await User.findById(userId);
    
    if (!user) {
      console.log('User not found!');
      return;
    }
    
    console.log('User found:', user.email);
    console.log('Current subscription:', JSON.stringify(user.subscription, null, 2) || 'None');
    
    let updated = false;
    
    // Check if user has subscription data
    if (!user.subscription) {
      // Create a sample subscription
      user.subscription = {
        planId: 'bronze',
        planName: 'Bronze Plan',
        expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
        stripeSubscriptionId: 'sample_sub_id',
        features: {
          resumeViews: {
            limit: 100,
            used: 0
          },
          jobPosting: {
            limit: 5,
            used: 0
          }
        }
      };
      updated = true;
    } else {
      // Check if feature limits are properly set
      const hasZeroLimits = 
        !user.subscription.features || 
        !user.subscription.features.resumeViews || 
        !user.subscription.features.jobPosting ||
        user.subscription.features.resumeViews.limit === 0 ||
        user.subscription.features.jobPosting.limit === 0;
      
      if (hasZeroLimits) {
        console.log('Fixing subscription limits...');
        
        // Determine plan type from name
        let planName = user.subscription.planName || 'Bronze Plan';
        let resumeViewsLimit = 100; // Default bronze
        let jobPostingLimit = 5;   // Default bronze
        
        if (planName.toLowerCase().includes('silver')) {
          resumeViewsLimit = 200;
          jobPostingLimit = 10;
        } else if (planName.toLowerCase().includes('gold')) {
          resumeViewsLimit = 500;
          jobPostingLimit = 20;
        }
        
        // Ensure proper feature structure
        if (!user.subscription.features) {
          user.subscription.features = {};
        }
        
        if (!user.subscription.features.resumeViews) {
          user.subscription.features.resumeViews = { limit: 0, used: 0 };
        }
        
        if (!user.subscription.features.jobPosting) {
          user.subscription.features.jobPosting = { limit: 0, used: 0 };
        }
        
        // Update limits
        user.subscription.features.resumeViews.limit = resumeViewsLimit;
        user.subscription.features.jobPosting.limit = jobPostingLimit;
        
        // Set used to 0 if not present
        user.subscription.features.resumeViews.used = 
          user.subscription.features.resumeViews.used || 0;
          
        user.subscription.features.jobPosting.used = 
          user.subscription.features.jobPosting.used || 0;
        
        updated = true;
      }
      
      // Ensure expiryDate is set properly
      if (!user.subscription.expiryDate) {
        user.subscription.expiryDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // 90 days
        updated = true;
      }
    }
    
    if (updated) {
      // Save updated user
      await user.save();
      console.log('Updated user with fixed subscription data:');
      console.log(JSON.stringify(user.subscription, null, 2));
    } else {
      console.log('No updates needed');
    }
    
    // Disconnect from MongoDB
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
  } catch (error) {
    console.error('Error:', error);
  }
};

// User ID from the curl command
const userId = '67cda0d1ac5638e556b28072';
checkAndFixUser(userId); 