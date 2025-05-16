import express from 'express';
import SubscriptionStripeController from '../subscription-service/src/subcriptionStripe.controller.js';

const router = express.Router();

// Route to create default prices
router.post('/create-default-prices', SubscriptionStripeController.createDefaultPrices);

// Route to get all prices
router.get('/prices', SubscriptionStripeController.getAllPrices);

// Route to create a new subscription plan
router.post('/plans', SubscriptionStripeController.createSubscriptionPlan);

// Route to retrieve a subscription plan
router.get('/plans/:planId', SubscriptionStripeController.getSubscriptionPlan);

// Route to update a subscription plan
router.put('/plans/:planId', SubscriptionStripeController.updateSubscriptionPlan);

// Route to delete a subscription plan
router.delete('/plans/:planId', SubscriptionStripeController.deleteSubscriptionPlan);

// Route to create a checkout session
router.post('/create-checkout-session', SubscriptionStripeController.createCheckoutSession);

// Route to create a portal session
router.post('/create-portal-session', SubscriptionStripeController.createPortalSession);

// Route to handle webhook
router.post('/webhook', SubscriptionStripeController.handleWebhook);

export default router; 