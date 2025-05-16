/**
 * Migration script to fix null email values in CandidateProfile collection
 * Run with: node scripts/fixCandidateEmails.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://Shreyas4545:sJY755G8Jh4CRoHw@cluster0.eao1l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Create a schema that matches the existing CandidateProfile schema
const candidateSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  password: { type: String },
  // Other fields omitted for brevity
}, { timestamps: true });

async function fixCandidateEmails() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
    
    // Create a temporary model (won't affect actual schema)
    const CandidateProfile = mongoose.model('CandidateProfile', candidateSchema);
    
    // Find candidates with null or undefined emails
    const invalidCandidates = await CandidateProfile.find({
      $or: [
        { email: null },
        { email: '' },
        { email: { $exists: false } }
      ]
    });
    
    console.log(`Found ${invalidCandidates.length} candidates with missing or invalid emails`);
    
    let updated = 0;
    
    // Update each candidate with a placeholder email
    for (const candidate of invalidCandidates) {
      const placeholderEmail = `placeholder-${uuidv4()}@example.com`;
      
      await CandidateProfile.updateOne(
        { _id: candidate._id },
        { 
          $set: { 
            email: placeholderEmail 
          } 
        }
      );
      
      console.log(`Updated candidate ${candidate._id}: set email to ${placeholderEmail}`);
      updated++;
    }
    
    console.log(`Successfully updated ${updated} candidates with placeholder emails`);
    
    // Find candidates with duplicate emails
    const emailGroups = await CandidateProfile.aggregate([
      { $match: { email: { $ne: null } } },
      { $group: { _id: '$email', count: { $sum: 1 }, docs: { $push: '$_id' } } },
      { $match: { count: { $gt: 1 } } }
    ]);
    
    console.log(`Found ${emailGroups.length} email addresses with duplicates`);
    
    let fixedDuplicates = 0;
    
    // Fix duplicate emails by adding a unique suffix to all but the first occurrence
    for (const group of emailGroups) {
      const duplicateIds = group.docs.slice(1); // Skip the first one
      
      for (const id of duplicateIds) {
        const originalEmail = group._id;
        const newEmail = `${originalEmail.split('@')[0]}+${uuidv4().slice(0, 8)}@${originalEmail.split('@')[1]}`;
        
        await CandidateProfile.updateOne(
          { _id: id },
          { $set: { email: newEmail } }
        );
        
        console.log(`Updated duplicate for ${originalEmail}: ${newEmail}`);
        fixedDuplicates++;
      }
    }
    
    console.log(`Successfully fixed ${fixedDuplicates} duplicate email entries`);
    
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the migration
fixCandidateEmails(); 