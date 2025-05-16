// Import necessary modules
import stripePackage from "stripe";
import mongoose from "mongoose";

const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);
const User = mongoose.model("User");

// Controller for managing subscription plans
class SubscriptionStripeController {
  // Create a new subscription plan
  async createSubscriptionPlan(req, res) {
    try {
      const { email, productId, amount, currency, interval, intervalCount } =
        req.body;

      let plan = null;
      // Check if the plan already exists
      try {
        plan = await stripe.plans.list({
          active: true,
          product: productId,
        });
      } catch (error) {
        console.log("Error Here :: ", error);
      }
      console.log("Plan Here", plan.data);

      if (plan === null || plan.data.length === 0) {
        plan = await stripe.plans.create({
          amount,
          currency,
          interval,
          product: productId,
          interval_count: intervalCount,
        });
      } else {
        plan = plan.data[0];
      }

      const product = await stripe.products.list({
        active: true,
        ids: [productId],
      });

      console.log("product here", product);
      // Update user with subscription details
      const user = await User.findOneAndUpdate(
        { email },
        {
          subscriptionPlan: plan.id,
          subscriptionExpiry: new Date(
            Date.now() + interval * 24 * 60 * 60 * 1000
          ), // Interval is in days
          isSubscribed: true,
          planName: name,
        },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(201).json({ plan, user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get a subscription plan by ID (method for internal use)
  async getSubscriptionPlanById(planId) {
    try {
      const plan = await stripe.plans.retrieve(planId);

      // Get product details to retrieve metadata
      const product = await stripe.products.retrieve(plan.product);

      // Create a plan object with limits from metadata or defaults
      const planWithLimits = {
        id: plan.id,
        name: product.name,
        amount: plan.amount,
        currency: plan.currency,
        interval: plan.interval,
        intervalCount: plan.interval_count,
        // Extract limits from metadata or use defaults
        resumeViewLimit:
          product.metadata?.resume_view_limit ||
          this.getDefaultLimitForPlan(product.name, "resumeViews"),
        jobPostLimit:
          product.metadata?.job_post_limit ||
          this.getDefaultLimitForPlan(product.name, "jobPosting"),
      };

      return planWithLimits;
    } catch (error) {
      console.error("Error retrieving plan:", error);
      return null;
    }
  }

  // Helper method to get default limits based on plan name
  getDefaultLimitForPlan(planName, featureType) {
    const planNameLower = planName?.toLowerCase() || "";

    if (featureType === "resumeViews") {
      if (planNameLower.includes("bronze")) return 100;
      if (planNameLower.includes("silver")) return 200;
      if (planNameLower.includes("gold")) return 500;
      return 50; // Default value
    }

    if (featureType === "jobPosting") {
      if (planNameLower.includes("bronze")) return 5;
      if (planNameLower.includes("silver")) return 10;
      if (planNameLower.includes("gold")) return 20;
      return 2; // Default value
    }

    return 0;
  }

  // Retrieve a subscription plans
  async getSubscriptionPlan(req, res) {
    try {
      const { planId } = req.params;
      const plan = await stripe.plans.retrieve(planId);
      res.status(200).json({ plan });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Update a subscription plan
  async updateSubscriptionPlan(req, res) {
    try {
      const { planId } = req.params;
      const { name } = req.body;
      const plan = await stripe.plans.update(planId, { name });
      res.status(200).json({ plan });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Delete a subscription plan
  async deleteSubscriptionPlan(req, res) {
    try {
      const { planId } = req.params;
      const deleted = await stripe.plans.del(planId);
      res.status(200).json({ deleted });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Check if a user is subscribed to a plan
  async checkUserSubscription(req, res) {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isSubscribed =
        user.subscriptionPlan && new Date(user.subscriptionExpiry) > new Date();

      res.status(200).json({
        isSubscribed,
        subscriptionPlan: user.subscriptionPlan,
        subscriptionExpiry: user.subscriptionExpiry,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Webhook to handle subscription renewals
  async handleWebhook(req, res) {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === "invoice.payment_succeeded") {
      const subscription = event.data.object;

      // Find the user by subscription ID
      const user = await User.findOne({
        subscriptionPlan: subscription.plan.id,
      });

      if (user) {
        // Reset counts
        user.resumeDownloadCount = 0;
        user.messagingCount = 0;
        await user.save();
      }
    }

    // Return a response to acknowledge receipt of the event
    res.json({ received: true });
  }

  // Create a Stripe Checkout Session with Payment Intent
  async createCheckoutSession(req, res) {
    try {
      const { priceId, email, id, name } = req.body;

      console.log("Received request body:", req.body);
      console.log("Price ID received:", priceId);

      if (!priceId) {
        return res.status(400).json({ error: "Price ID is required" });
      }

      // Get the price details to calculate the correct amount
      const price = await stripe.prices.retrieve(priceId);
      console.log(price);
      if (!price) {
        return res.status(400).json({ error: "Invalid price ID" });
      }

      // Create a customer or use existing
      const customer = await stripe.customers.create({
        email: email || undefined,
        name: name || undefined,
      });

      // Create a subscription
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [
          {
            price: priceId,
          },
        ],
        payment_behavior: "default_incomplete",
        payment_settings: { save_default_payment_method: "on_subscription" },
        expand: ["latest_invoice.payment_intent"],
      });

      // Return the client secret to complete the payment on the frontend

      await User.findOneAndUpdate(
        { _id: id },
        { $set: { subscriptionId: subscription?._id } }
      );

      res.status(200).json({
        subscriptionId: subscription.id,
        clientSecret: subscription.latest_invoice.payment_intent.client_secret,
        customerId: customer.id,
      });
    } catch (err) {
      console.error("Error creating subscription:", err);
      res.status(500).json({ error: err.message });
    }
  }

  // Create a Stripe Customer Portal Session
  async createPortalSession(req, res) {
    try {
      const { customerId } = req.body;

      // If no customer ID is provided, create a new customer
      // In a production app, you would get the customerId from your database
      const customer =
        customerId ||
        (await stripe.customers.create({
          metadata: {
            userId: req.user?.id || "unknown", // Use authenticated user if available
          },
        }));

      const customerIdToUse = customerId || customer.id;

      // Create Portal Session
      const session = await stripe.billingPortal.sessions.create({
        customer: customerIdToUse,
        return_url: `${process.env.FRONTEND_URL}/account`,
      });

      res.status(200).json({ url: session.url });
    } catch (err) {
      console.error("Error creating portal session:", err);
      res.status(500).json({ error: err.message });
    }
  }

  // Create default prices for the subscription plans
  async createDefaultPrices(req, res) {
    try {
      const plans = [
        {
          name: "Bronze Plan",
          id: "bronze",
          amount: 50000, // $500.00 in cents
          interval: "day",
          interval_count: 90,
          features: "100 resume views, 5 job postings",
        },
        {
          name: "Silver Plan",
          id: "silver",
          amount: 80000, // $800.00 in cents
          interval: "day",
          interval_count: 180,
          features: "200 resume views, 10 job postings",
        },
        {
          name: "Gold Plan",
          id: "gold",
          amount: 120000, // $1200.00 in cents
          interval: "day",
          interval_count: 365,
          features: "500 resume views, 20 job postings",
        },
      ];

      const results = [];

      for (const plan of plans) {
        // Create or get product
        let product = await stripe.products.create({
          name: plan.name,
          description: plan.features,
          metadata: {
            plan_id: plan.id,
          },
        });

        // Create price for the product
        const price = await stripe.prices.create({
          product: product.id,
          unit_amount: plan.amount,
          currency: "usd",
          recurring: {
            interval: plan.interval,
            interval_count: plan.interval_count,
          },
          metadata: {
            plan_id: plan.id,
          },
        });

        results.push({
          product: product,
          price: price,
        });
      }

      res.status(200).json({
        success: true,
        message: "Default prices created",
        data: results,
      });
    } catch (error) {
      console.error("Error creating default prices:", error);
      res.status(500).json({ error: error.message });
    }
  }

  // Get all prices
  async getAllPrices(req, res) {
    try {
      const prices = await stripe.prices.list({
        limit: 10,
        active: true,
        expand: ["data.product"],
      });

      res.status(200).json(prices);
    } catch (error) {
      console.error("Error fetching prices:", error);
      res.status(500).json({ error: error.message });
    }
  }
}

export default new SubscriptionStripeController();
