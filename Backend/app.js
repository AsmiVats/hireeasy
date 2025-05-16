import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import logger from "./utils/logger.js";

// Remove this import as it's no longer needed
// import './packages/models/User.js';

import authRoutes from "./packages/routes/auth.routes.js";
import jobRoutes from "./packages/routes/jobPoster.routes.js";
import fileRoutes from "./packages/cloudinary-service/src/fileUpload.controller.js";
import jobSeekerRoutes from "./packages/routes/jobSeeker.routes.js";
import demoRoutes from "./packages/routes/demo.routes.js";
import subscriptionRoutes from "./packages/routes/subscription.routes.js";
import messageRoutes from "./packages/routes/message.routes.js";
import questionarreRoutes from "./packages/routes/questionarre.routes.js";
import subscriptionStripeRoutes from "./packages/routes/subcriptionStripe.routes.js";
import userRoutes from "./packages/routes/user.routes.js";
import { sendMail, sendMail1 } from "./utils/sendMail.js";
import admin from "firebase-admin";
import fileUpload from "express-fileupload";
import { v4 as uuidv4 } from "uuid";
import jobdivaRoutes from "./packages/routes/jobdiva.routes.js";
import { initJobDivaSyncJobs } from "./packages/jobdiva-service/src/jobdiva.cron.js";
import authService from "./utils/jobdiva/jobdivaAuth.js";
import { bookDemoConfirmationToUser } from "./utils/emailTemplate/bookDemoConfirmationToUser.js";

const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
  storageBucket: firebaseConfig.project_id + ".appspot.com",
});

const bucket = admin.storage().bucket();

async function connectDB() {
  try {
    await mongoose.connect(
      "mongodb+srv://Shreyas4545:sJY755G8Jh4CRoHw@cluster0.eao1l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000, // Timeout after 5s
        socketTimeoutMS: 45000, // Increase socket timeout
        maxPoolSize: 10, // Limit connections
      }
    );

    logger.db("MongoDB Connected Successfully");
  } catch (err) {
    logger.error("Error in connecting to MongoDB", err);
  }
}

connectDB();

const app = express();

// Remove the old custom logging middleware
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

// CORS configuration - simplify
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://now-edge-web-frontend-197890003932.us-central1.run.app",
      "https://now-edge-web-frontend.vercel.app"
    ],
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
      "Referer",
      "User-Agent",
      "sec-ch-ua",
      "sec-ch-ua-mobile",
      "sec-ch-ua-platform",
    ],
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  })
);

// Add preflight handler
app.options("*", cors());

app.set("trust proxy", 1);

// Body parser middleware
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.json());
app.use(bodyParser.json({ limit: "16mb" }));

// File upload middleware
app.use(fileUpload());

// Timestamp middleware
app.use((req, res, next) => {
  req.time = new Date().toISOString();

  // Log request details
  logger.request(req.method, req.originalUrl, req.ip);

  // Track response time
  const startTime = Date.now();

  // Capture the original end method
  const originalEnd = res.end;

  // Override the end method to log response details
  res.end = function (chunk, encoding) {
    // Calculate response time
    const duration = Date.now() - startTime;

    // Log response details
    logger.response(req.method, req.originalUrl, res.statusCode, duration);

    // Call the original end method
    return originalEnd.call(this, chunk, encoding);
  };

  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/fileRoute", fileRoutes);
app.use("/api/demo", demoRoutes);
app.use("/api/jobSeeker", jobSeekerRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/subscriptionsStripe", subscriptionStripeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/questionarre", questionarreRoutes);
app.use("/api/jobdiva", jobdivaRoutes);

// CandidateProfile.collection
//   .createIndex({ name: "text" })
//   .then(() => console.log("✅ Text index created on 'name' field"))
//   .catch((err) => console.error("❌ Error creating text index:", err));

app.get("/", async (req, res) => {
  try {
    mongoose.connect(
      "mongodb+srv://Shreyas4545:sJY755G8Jh4CRoHw@cluster0.eao1l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
    logger.db("Mongo Db Connected Successfully");
    return res.status(200).json({ status: "success" });
  } catch (err) {
    logger.error("Error in connecting to MongoDb", err);
    return res.status(501).json({
      success: false,
      message: `Something went wrong + ${err}`,
    });
  }
});

app.post("/sendMail", async (req, res) => {
  try {
    const { from, to, subject, text } = req.body;
    logger.info(`Sending mail from ${from} to ${to} with subject: ${subject}`);

    await sendMail(from, to, subject, text)
      .then((data) => {
        logger.success(`Mail sent successfully to ${to}`);
        return res.status(200).json({
          success: true,
          message: "Successfully Sent Mail",
        });
      })
      .catch((err) => {
        logger.error(`Error sending mail to ${to}`, err);
        return res.status(501).json({
          success: false,
          message: `Something went wrong + ${err}`,
        });
      });
  } catch (err) {
    logger.error("Error in sendMail endpoint", err);
    return res.status(501).json({
      success: false,
      message: `Something went wrong + ${err}`,
    });
  }
});

app.post("/sendMailToClient", async (req, res) => {
  try {
    const { to, subject, date, time, name } = req.body;
    const from = "nextcommon321@gmail.com";
    logger.info(`Sending mail to client ${to} with subject: ${subject}`);

    await sendMail1(
      from,
      to,
      subject,
      bookDemoConfirmationToUser(name, date, time)
    )
      .then((data) => {
        logger.success(`Mail sent successfully to client ${to}`);
        return res.status(200).json({
          success: true,
          message: "Successfully Sent Mail to Client",
        });
      })
      .catch((err) => {
        logger.error(`Error sending mail to client ${to}`, err);
        return res.status(501).json({
          success: false,
          message: `Something went wrong + ${err}`,
        });
      });
  } catch (err) {
    logger.error("Error in sendMailToClient endpoint", err);
    return res.status(501).json({
      success: false,
      message: `Something went wrong + ${err}`,
    });
  }
});

app.post("/api/uploadFile", async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      logger.warning("No file received in upload request");
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = req.files.file;
    const uniqueFileName = `uploads/${uuidv4()}_${file.name}`;
    logger.info(
      `Uploading file: ${file.name} to Firebase as ${uniqueFileName}`
    );

    const fileUpload = bucket.file(uniqueFileName);

    // Upload file to Firebase
    await fileUpload.save(file.data, {
      metadata: { contentType: file.mimetype },
    });

    // Make file public
    await fileUpload.makePublic();

    const fileUrl = `https://storage.googleapis.com/${bucket.name}/${uniqueFileName}`;
    logger.success(`File uploaded successfully: ${fileUrl}`);

    res.json({ success: true, fileUrl });
  } catch (error) {
    logger.error("File upload failed", error);
    res.status(500).json({ error: "File upload failed" });
  }
});

// Initialize JobDiva synchronization cron jobs if integration is enabled
const ENABLE_JOBDIVA_INTEGRATION =
  process.env.ENABLE_JOBDIVA_INTEGRATION === "true";
const ENABLE_JOBDIVA_SYNC = process.env.ENABLE_JOBDIVA_SYNC === "true";

if (ENABLE_JOBDIVA_INTEGRATION && ENABLE_JOBDIVA_SYNC) {
  logger.info(
    "JobDiva integration and sync are enabled, initializing cron jobs"
  );
  initJobDivaSyncJobs();
} else {
  if (!ENABLE_JOBDIVA_INTEGRATION) {
    logger.info("JobDiva integration is disabled");
  }
  if (!ENABLE_JOBDIVA_SYNC) {
    logger.info("JobDiva synchronization is disabled");
  }
}

export default app;
