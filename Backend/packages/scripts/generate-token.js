import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User } from '../auth-service/src/auth.controller.js';

const generateToken = async (userId) => {
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
    
    // Generate a token with long expiry for testing
    // Use the same secret as in auth controller
    const token = jwt.sign(
      { id: user._id, email: user.email },
      'ALPHABETAGAMA', // Use the exact same secret as in auth.controller.js
      { expiresIn: '2d' } // 2 days
    );
    
    console.log('\nGenerated JWT token for testing:');
    console.log(token);
    
    // Print curl command for convenience
    console.log('\nCURL command to test API:');
    console.log(`curl 'http://localhost:8080/api/subscription/user/${userId}' \\
  -H 'Authorization: Bearer ${token}'`);
    
    // Disconnect from MongoDB
    mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
    
  } catch (error) {
    console.error('Error:', error);
  }
};

// User ID from the curl command
const userId = '67cda0d1ac5638e556b28072';
generateToken(userId); 