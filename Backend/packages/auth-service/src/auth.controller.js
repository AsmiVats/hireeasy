import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Otp } from "../../jobseeker-service/src/jobseekerController.js";
import { sendMail1 } from "../../../utils/sendMail.js";
import { CandidateProfile } from "../../jobseeker-service/src/jobseekerController.js";
import logger from "../../../utils/logger.js";
import { passwordReset } from "../../../utils/emailTemplate/passwordReset.js";
import { hireEasyEmails } from "../../../utils/reusableConstants.js";
import { verifyEmail } from "../../../utils/emailTemplate/verifyEmail.js";

// User Model Here
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Employer's full name
    companyName: { type: String }, // Name of the company
    companyDescription: { type: String },
    companySize: {
      type: String,
    },
    email: { type: String, required: true, unique: true },
    password: String,
    userType: String,
    isActive: Boolean,
    isVerified: { type: Boolean, default: false },
    inviteCode: { type: String },
    createdAt: Date,
    logoUrl: { type: String }, // URL of the company logo
    phone: { type: Number },
    location: { type: String },
    resumeDownloadCount: { type: Number, default: 0 },
    jobPostCount: { type: Number, default: 0 }, // Count of job posts made by the user
    subscriptionPlan: {
      type: String,
      enum: ["Bronze", "Silver", "Unlimited", "Basic"],
    }, // Stripe plan ID
    subscriptionId: { type: String }, // Stripe subscription ID
    customerId: { type: String }, // Stripe customer ID
    subscriptionExpiry: { type: Date }, // Expiry date of the subscription
    // New subscription model - structured data
    subscription: {
      planId: { type: String },
      planName: { type: String },
      expiryDate: { type: Date },
      stripeSubscriptionId: { type: String },
      features: {
        resumeViews: {
          limit: { type: Number, default: 0 },
          used: { type: Number, default: 0 },
        },
        jobPosting: {
          limit: { type: Number, default: 0 },
          used: { type: Number, default: 0 },
        },
      },
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);

// Generate auth token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      userType: user.userType ? user?.userType : "Candidate",
    },
    process.env.JWT_SECRET || "ALPHABETAGAMA",
    { expiresIn: "24h" }
  );
};

export const signup = async (req, res) => {
  try {
    const {
      name,
      companySize,
      companyName,
      email,
      password,
      logoUrl,
      phone,
      userType,
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }
    const existingCandidate = await CandidateProfile.findOne({ email });
    if (existingCandidate) {
      return res.status(400).json({ message: "Email already registered" });
    }
    const code = Math.floor(1000 + Math.random() * 9000);
    if (userType === "Candidate") {
      const candidate = new CandidateProfile({
        email,
        name,
        password: hashedPassword,
        resumeLink: logoUrl,
        inviteCode: code,
      });
      await candidate.save();
      const token = generateToken(candidate);
      const link = `${process.env.FRONTEND_URL}/verify-email?email=${email}&nwtoken=${token}`;
      await sendMail1(
        hireEasyEmails[0],
        email,
        "Verify your Email",
        verifyEmail(name, code, link),
      );

      res.status(201).json({
        message: "User registered successfully",
        token,
        userId: candidate._id,
        success: true
      });
    } else {
      const user = new User({
        email,
        name,
        companySize,
        companyName,
        password: hashedPassword,
        userType: userType ? userType : "Candidate",
        logoUrl,
        phone,
        isActive: false,
        inviteCode: code,
        createdAt: new Date(),
      });
      await user.save();

      // Generate token
      const token = generateToken(user);
      const link = `${process.env.FRONTEND_URL}/verify-email?email=${email}&nwtoken=${token}`;
      await sendMail1(
        hireEasyEmails[0],
        email,
        "Verify your Email",
        verifyEmail(name, code, link),
      );

      res.status(201).json({
        message: "User registered successfully",
        token,
        userId: user._id,
        success: true
      });
    }

  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

// Login endpoint
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let isEmailVerificationPending = false;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      const candidate = await CandidateProfile.findOne({ email });

      if (!candidate) {
        return res.status(404).json({ sucess: false, message: "Not found", isEmailVerificationPending  });
      }
      if (!candidate.isVerified) {
        isEmailVerificationPending = true;
        return res.status(401).json({ message: "Email not verified", isEmailVerificationPending  });
      }

      const isValidPassword = await bcrypt.compare(
        password,
        candidate?.password
      );

      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials", isEmailVerificationPending  });
      }

      const token = generateToken(candidate);

      const utcDate = new Date();
      const istDate = new Date(utcDate.getTime() + 5.5 * 60 * 60 * 1000);

      await CandidateProfile.findOneAndUpdate(
        { _id: candidate?._id },
        { $set: { lastActive: istDate } }
      );

      res.json({
        message: "Login successfull",
        token,
        candidateId: candidate?._id,
        role: "Candidate",
      });
    } else {
      // Verify password
      if (!user.isVerified) {
        isEmailVerificationPending = true;
        return res.status(401).json({ message: "Email not verified", isEmailVerificationPending   });
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials", isEmailVerificationPending });
      }

      const token = generateToken(user);

      res.json({
        message: "Login successfull",
        token,
        userId: user._id,
        role: user?.userType,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

export const verifySignup = async (req, res) => {
  try {
    const { email, inviteCode, token } = req.body;
    if (!email || !inviteCode || !token) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "ALPHABETAGAMA");
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    let user = await User.findOne({ email });
    if (user) {
      if (user.inviteCode !== inviteCode) {
        return res.status(400).json({ message: "Invalid invite code" });
      }
      user.isVerified = true;
      await user.save();
      return res.json({ message: "Email verified successfully", userType: user.userType });
    }
    let candidate = await CandidateProfile.findOne({ email });
    if (candidate) {
      if (candidate.inviteCode !== inviteCode) {
        return res.status(400).json({ message: "Invalid invite code" });
      }
      candidate.isVerified = true;
      await candidate.save();
      return res.json({ message: "Email verified successfully", userType: "Candidate" });
    }
    return res.status(404).json({ message: "Email not found" });
  } catch (error) {
    res.status(500).json({ message: "Error verifying signup", error: error.message });
  }
};
export const resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      const candidate = await CandidateProfile.findOne({ email });
      if (!candidate) {
        return res.status(404).json({ message: "User not found" });
      }
      if(candidate.isVerified) {
        return res.status(400).json({ message: "User already verified" });
      }
      const code = Math.floor(1000 + Math.random() * 9000);
      candidate.inviteCode = code;
      await candidate.save();
      const token = generateToken(candidate);
      const link = `${process.env.FRONTEND_URL}/verify-email?email=${email}&nwtoken=${token}`;
      await sendMail1(
        hireEasyEmails[0],
        email,
        "Verify your Email",
        verifyEmail(candidate.name, code, link),
      )
      return res.json({ message: "Verification code resent" });
    }
    if(user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }
    const code = Math.floor(1000 + Math.random() * 9000);
    user.inviteCode = code;
    await user.save();
    const token = generateToken(user);
      const link = `${process.env.FRONTEND_URL}/verify-email?email=${email}&nwtoken=${token}`;
      await sendMail1(
        hireEasyEmails[0],
        email,
        "Verify your Email",
        verifyEmail(user.name, code, link),
      );
    res.json({ message: "Verification code resent" });
  } catch (error) {
    res.status(500).json({ message: "Error sending reset email", error: error.message });
  }
}
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      const candidate = await CandidateProfile.findOne({ email });
      if (!candidate) {
        return res.status(404).json({ message: "User not found" });
      }
      const token = generateToken(candidate);
      const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
      await sendMail1(
        hireEasyEmails[0],
        email,
        "Reset Password",
        passwordReset(email, link)
      );
      return res.json({ message: "Password reset email sent" });
    }
    const token = generateToken(user);
    const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    await sendMail1(
      hireEasyEmails[0],
      email,
      "Reset Password",
      passwordReset(email, link)
    );
    res.json({ message: "Password reset email sent" });
  } catch (error) {
    res.status(500).json({ message: "Error sending reset email", error: error.message });
  }
}
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "ALPHABETAGAMA");
    const user = await User.findById(decoded.id);
    if (!user) {
      const candidate = await CandidateProfile.findById(decoded.id);
      if (!candidate) {
        return res.status(404).json({ message: "User not found" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      candidate.password = hashedPassword;
      await candidate.save();
      return res.json({ message: "Password reset successfully" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();
    res.json({ message: "Password reset successfully" });
  }
  catch (error) {
    res.status(500).json({ message: "Error resetting password", error: error.message });
  }
}
export const getUsers = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user || req.user.userType !== "admin") {
      return res
        .status(403)
        .json({ message: "Unauthorized: Admin access required" });
    }

    const users = await User.find({}).select("-password");

    return res.json({
      message: "Users sent successfully",
      data: users,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

// New secure endpoint to get current user data
export const getCurrentUser = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const userId = req.user._id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Format the user data to ensure subscription plan is properly included
    const userData = user.toObject();

    // Log the raw user data to diagnose subscription issues
    logger.auth("userData", userData);

    // Make sure subscription data includes the plan name if subscription exists
    if (userData.subscription) {
      // Ensure plan name is set if missing but planId exists
      if (!userData.subscription.planName && userData.subscription.planId) {
        const planIdLower = userData.subscription.planId.toLowerCase();
        logger.auth("User subscription plan check", {
          planId: userData.subscription.planId,
          existingPlanName: userData.subscription.planName,
        });

        if (planIdLower.includes("bronze")) {
          userData.subscription.planName = "Bronze Plan";
        } else if (planIdLower.includes("silver")) {
          userData.subscription.planName = "Silver Plan";
        } else if (planIdLower.includes("unlimited")) {
          userData.subscription.planName = "Unlimited Plan";
        } else {
          userData.subscription.planName = "Basic Plan";
        }

        logger.auth("Plan name derived for /me endpoint", {
          derivedPlanName: userData.subscription.planName,
        });
      }

      // If there's still no plan name, set a default
      if (!userData.subscription.planName) {
        // If subscriptionPlan field exists on the user, use that
        if (userData.subscriptionPlan) {
          userData.subscription.planName = `${userData.subscriptionPlan} Plan`;
          logger.auth("Plan name set from subscriptionPlan field", {
            planName: userData.subscription.planName,
          });
        } else {
          userData.subscription.planName = "Basic Plan";
          logger.auth("Default plan name set", {
            planName: userData.subscription.planName,
            userData: userData,
          });
        }
      }
    } else if (userData.subscriptionPlan) {
      // If the user has a subscriptionPlan field but no structured subscription object,
      // create a basic subscription object with the plan name
      userData.subscription = {
        planId: userData.subscriptionPlan.toLowerCase(),
        planName: `${userData.subscriptionPlan} Plan`,
        expiryDate: userData.subscriptionExpiry || new Date(),
        features: {
          resumeViews: { limit: 0, used: 0 },
          jobPosting: { limit: 0, used: 0 },
        },
      };
      logger.auth("Created subscription object from legacy fields", {
        planName: userData.subscription.planName,
      });
    }

    // Save the updated userData back to the database to ensure plans persist
    await User.findByIdAndUpdate(userId, {
      "subscription.planName": userData.subscription?.planName,
      "subscription.planId": userData.subscription?.planId,
    });

    return res.json({
      message: "User data retrieved successfully",
      data: userData,
    });
  } catch (error) {
    logger.error("Error in getCurrentUser:", error);
    res
      .status(500)
      .json({ message: "Error fetching user data", error: error.message });
  }
};

// Verify token middleware
export const jwtVerify = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "ALPHABETAGAMA"
    );
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    res.json({
      valid: true,
      user: { id: user._id, email: user.email, userType: user.userType },
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid token", error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    let updateObj = {};
    const {
      companyDescription,
      name,
      companyName,
      location,
      companySize,
      logoUrl,
      email,
      phone,
      isActive,
      password,
      resumeDownloadCount,
    } = req.body;

    if (companyDescription) {
      updateObj.companyDescription = companyDescription;
    }
    if (name) {
      updateObj.name = name;
    }
    if (location) {
      updateObj.location = location;
    }
    if (isActive || isActive == false) {
      updateObj.isActive = isActive;
    }
    if (companyName) {
      updateObj.companyName = companyName;
    }
    if (companySize) {
      updateObj.companySize = companySize;
    }
    if (logoUrl) {
      updateObj.logoUrl = logoUrl;
    }
    if (email) {
      updateObj.email = email;
    }
    if (phone) {
      updateObj.phone = phone;
    }
    if (resumeDownloadCount) {
      updateObj.resumeDownloadCount = resumeDownloadCount;
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateObj.password = hashedPassword;
    }

    const user = await User.findOneAndUpdate(
      { _id: id },
      { $set: updateObj },
      {
        new: true,
      }
    ).catch((err) => {
      console.log(err);
    });

    return res.json({
      message: "Update successful",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.query;
    await User.deleteOne({ _id: new mongoose.Types.ObjectId(userId) });
    return res.json({
      message: "Delete Successfull",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error Deleting User" });
  }
};

export const sendOtp = async (req, res) => {
  const { email, code } = req.query;

  let commonUser = await User.find({ email: email, isActive: true }).catch(
    (err) => {
      console.log(err);
    }
  );

  if (!commonUser || commonUser.length == 0) {
    commonUser = await CandidateProfile.find({
      email: email,
      isActive: true,
    });
  }

  if (!commonUser || commonUser?.length == 0) {
    return res.status(404).json({
      success: false,
      message: "You have not created account",
    });
  }

  const from = hireEasyEmails[0];
  const to = email;
  const subject = `Password Reset Code`;
  await sendMail1(from, to, subject, passwordReset(commonUser[0]?.name, code));

  const otpObj = {
    email: email,
    otp: code,
  };

  await Otp.updateOne({ email: to }, { $set: otpObj }, { upsert: true })
    .then((data) => {
      return res.status(200).json({
        success: true,
        message: "Successfully sent code to your mail",
      });
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(500)
        .json({ success: false, message: "Something went wrong" });
    });
};

export const verifyOtp = async (req, res) => {
  try {
    const { code, email } = req.query;

    const otp = await Otp.find({ email: email });

    if (otp[0]?.otp == code) {
      return res.status(200).json({
        success: true,
        message: "Success",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Incorrect OTP",
      });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};
