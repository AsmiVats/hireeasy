import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import logger from '../../utils/logger.js';
import { CandidateProfile } from '../jobseeker-service/src/jobseekerController.js';

const User = mongoose.model('User');

export const authenticateJWT = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    logger.auth(`Auth header: ${authHeader ? 'Present' : 'Missing'}`);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided, authorization denied' });
    }
    
    // Extract token
    const token = authHeader.split(' ')[1];
    logger.auth(`Token extracted: ${token ? 'Present' : 'Missing'}`);
    
    if (!token) {
      return res.status(401).json({ message: 'Invalid token format, authorization denied' });
    }
    
    try {
      logger.auth('Attempting to verify token with JWT secret');
      // Verify token using the correct secret
      const decoded = jwt.verify(token, 'ALPHABETAGAMA');
      logger.auth('Token decoded', { userId: decoded.id });
      const user = await User.findById(decoded.id).select('-password');
      logger.auth(`User found: ${user ? 'Yes' : 'No'}`);
      if (!user) {
        const candidate = await CandidateProfile.findById(decoded.id).select('-password');
        if (!candidate) {
          return res.status(404).json({ message: 'User not found' });
        }
        if(!candidate.isVerified){
          return res.status(401).json({ message: 'Email not verified' });
        }
        req.user = candidate;
        return next();
      }
      if(!user.isVerified){
        return res.status(401).json({ message: 'Email not verified' });
      }
      logger.auth(`User has subscription: ${user.subscription ? 'Yes' : 'No'}`);
      req.user = user;
      return next();
    } catch (err) {
      logger.error('Token verification failed:', err);
      return res.status(401).json({ message: 'Token is not valid', error: err.message });
    }
  } catch (err) {
    logger.error('Auth middleware error:', err);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// Middleware to check if user has an active subscription
export const requireActiveSubscription = async (req, res, next) => {
  try {
    // User should be attached by the authenticateJWT middleware
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    // Check if user has an active subscription
    if (!req.user.subscription) {
      return res.status(403).json({ message: 'Active subscription required' });
    }
    
    // Check if subscription is expired
    const expiryDate = new Date(req.user.subscription.expiryDate);
    if (expiryDate < new Date()) {
      return res.status(403).json({ message: 'Subscription has expired' });
    }
    
    next();
  } catch (err) {
    logger.error('Subscription check error:', err);
    return res.status(500).json({ message: 'Server Error' });
  }
}; 