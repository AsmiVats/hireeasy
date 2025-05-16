// scripts/init-mongodb.js

// Auth Service Database
db = db.getSiblingDB("talent-portal-auth");
db.createUser({
  user: "auth_user",
  pwd: "auth_password",
  roles: [{ role: "readWrite", db: "talent-portal-auth" }],
});

db.createCollection("users");
db.users.createIndex({ email: 1 }, { unique: true });

// Employer Service Database
db = db.getSiblingDB("talent-portal-employer");
db.createUser({
  user: "employer_user",
  pwd: "employer_password",
  roles: [{ role: "readWrite", db: "talent-portal-employer" }],
});

db.createCollection("jobs");
db.createCollection("subscriptions");
// db.jobs.createIndex({ "title": "text", "description": "text" });
// db.jobs.createIndex({ "status": 1, "createdAt": -1 });
db.subscriptions.createIndex({ employerId: 1 });

// Job Seeker Service Database
db = db.getSiblingDB("talent-portal-jobseeker");
db.createUser({
  user: "jobseeker_user",
  pwd: "jobseeker_password",
  roles: [{ role: "readWrite", db: "talent-portal-jobseeker" }],
});

db.createCollection("profiles");
db.createCollection("applications");
db.profiles.createIndex({ "skills.name": 1 });
db.applications.createIndex({ userId: 1, jobId: 1 }, { unique: true });
