const jobSchema = new mongoose.Schema(
  {
    // ... existing fields ...
    
    // Add these fields for JobDiva integration
    externalId: { 
      type: String,
      description: "ID from external system (e.g. JobDiva)"
    },
    externalSource: {
      type: String,
      description: "Source of external ID (e.g. 'JobDiva')"
    }
  },
  { timestamps: true }
); 