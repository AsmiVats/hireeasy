import stripePackage from 'stripe';

const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);

// Get a subscription plan by ID
export const getSubscriptionPlanById = async (planId) => {
  try {
    // Get price from Stripe
    const price = await stripe.prices.retrieve(planId, {
      expand: ['product']
    });
    
    if (!price) {
      return null;
    }
    
    // Create a plan object with limits from metadata or defaults
    const plan = {
      id: price.id,
      productId: price.product.id,
      name: price.product.name,
      description: price.product.description,
      amount: price.unit_amount / 100, // Convert cents to dollars
      currency: price.currency,
      interval: price.recurring?.interval,
      intervalCount: price.recurring?.interval_count,
      // Extract limits from metadata or use defaults
      resumeViewLimit: price.product.metadata?.resume_view_limit || getDefaultLimitForPlan(price.product.name, 'resumeViews'),
      jobPostLimit: price.product.metadata?.job_post_limit || getDefaultLimitForPlan(price.product.name, 'jobPosting')
    };
    
    return plan;
  } catch (error) {
    console.error('Error retrieving plan:', error);
    return null;
  }
};

// Helper function to get default limits based on plan name
export const getDefaultLimitForPlan = (planName, featureType) => {
  const planNameLower = planName?.toLowerCase() || '';
  
  if (featureType === 'resumeViews') {
    if (planNameLower.includes('bronze')) return 100;
    if (planNameLower.includes('silver')) return 200;
    if (planNameLower.includes('gold')) return 500;
    return 50; // Default value
  } 
  
  if (featureType === 'jobPosting') {
    if (planNameLower.includes('bronze')) return 5;
    if (planNameLower.includes('silver')) return 10;
    if (planNameLower.includes('gold')) return 20;
    return 2; // Default value
  }
  
  return 0;
}; 