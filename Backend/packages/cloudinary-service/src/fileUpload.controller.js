import cloudinary from "cloudinary";
import * as dotenv from "dotenv";
import multer from "multer";
import express from "express";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const router = express.Router();

dotenv.config({ path: `.env` });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "images", // Ensure this folder exists in Cloudinary
    format: async (req, file) => "png", // Force format (optional)
    public_id: (req, file) => file.originalname.split(".")[0], // Optional: Use file name as public ID
    transformation: [{ width: 500, height: 500, crop: "limit" }], // Ensure valid transformations
  },
});

const videoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "videos", // Folder name in Cloudinary
    resource_type: "video", // This is essential for videos
    allowed_formats: ["mp4", "avi", "mkv", "mov"], // File types allowed
  },
});

export const uploadImage = multer({ storage: imageStorage });

export const uploadVideo = multer({
  storage: videoStorage,
  limits: {
    fileSize: 1024 * 1024 * 1024, // 1GB (adjust according to your needs)
  },
});

router.post(
  "/upload/image",
  (req, res, next) => {
    console.log("📩 Route hit before Multer");
    next();
  },
  uploadImage.single("file"),
  (req, res, next) => {
    console.log("📤 Multer middleware executed");
    next();
  },
  (err, req, res, next) => {
    if (err) {
      console.error("❌ Multer/Cloudinary Error:", err);
      return res
        .status(500)
        .json({ message: "Multer/Cloudinary error", error: err.message });
    }
    next();
  },
  (req, res) => {
    if (!req.file) {
      console.log("❌ No file received");
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("✅ File uploaded to Cloudinary:", req.file);
    res.status(200).json({
      message: "Image uploaded successfully",
      fileUrl: req.file.path,
    });
  }
);

router.post("/upload/video", uploadVideo.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // File URL from Cloudinary
    const fileUrl = req.file.path;

    res.status(200).json({
      message: "Video uploaded successfully",
      fileUrl,
    });
  } catch (error) {
    res.status(500).json({ message: "Error uploading video", error });
  }
});

export default router;
