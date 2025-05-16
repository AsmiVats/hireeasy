import mongoose from "mongoose";
import Ably from "ably";
import { CommonMessage } from "../../employer-service/src/employerController.js";

const MessageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Candidate or Employer
  senderType: { type: String, enum: ["candidate", "employer"], required: true }, // Differentiating sender
  receiverId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Candidate or Employer
  receiverType: {
    type: String,
    enum: ["candidate", "employer"],
    required: true,
  },
  message: { type: String, required: true },
  sentAt: { type: Date, default: Date.now },
  viewedByReceiver: { type: Boolean, default: false }, // Track if the receiver has seen the message
});

export const Message = mongoose.model("Message", MessageSchema);

let ably = "";

const connectAbly = () => {
  ably = new Ably.Realtime(process.env.ABLY_API_KEY);
};

export const pushMessageOrActivity = async (receiverId, newMessage) => {
  connectAbly();
  // Publish message to Ably channel
  const channelName = `chat-${receiverId}`; // Unique channel for each receiver
  const channel = ably.channels.get(channelName);
  channel.publish("message", newMessage);
};

export const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, senderType, receiverType, message } =
      req.body;

    if (!senderId || !receiverId || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Store message in MongoDB
    const newMessage = new Message({
      senderId,
      receiverId,
      senderType,
      receiverType,
      message,
    });

    await newMessage.save();

    await pushMessageOrActivity();

    res
      .status(200)
      .json({ success: true, message: "Message sent", data: newMessage });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAuth = async (req, res) => {
  try {
    connectAbly();

    const tokenRequest = await ably.auth.createTokenRequest({});

    return res.status(200).json(tokenRequest);
  } catch (error) {
    console.error("Error generating token:", error);
    return res.status(500).json({ error: "Failed to generate token" });
  }
};

export const getUnreadMessages = async (req, res) => {
  try {
    const { employerId, page = 1, limit = 10 } = req.query;
    if (!employerId) {
      return res.status(400).json({ message: "Employer ID is required" });
    }

    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const skip = (pageNumber - 1) * pageSize;

    const messages = await Message.aggregate([
      {
        $match: {
          receiverId: new mongoose.Types.ObjectId(employerId),
          receiverType: "employer",
          viewedByReceiver: false, // Fetch only unread messages
        },
      },
      {
        $lookup: {
          from: "candidateprofiles", // Collection name
          localField: "senderId",
          foreignField: "_id", // Assuming userId in CandidateProfiles maps to senderId
          as: "candidateInfo",
        },
      },
      {
        $unwind: {
          path: "$candidateInfo",
          preserveNullAndEmptyArrays: true, // Keep even if no candidate profile exists
        },
      },
      {
        $project: {
          _id: 1,
          senderId: 1,
          senderType: 1,
          message: 1,
          createdAt: 1,
          viewedByEmployer: 1,
          profileHeadline: "$candidateInfo.profileHeadline",
          candidateName: "$candidateInfo.name",
        },
      },
      { $sort: { createdAt: -1 } }, // Latest messages first
      { $skip: skip },
      { $limit: pageSize },
    ]);

    // Total unread messages count for pagination
    const totalMessages = await Message.countDocuments({
      receiverId: new mongoose.Types.ObjectId(employerId),
      receiverType: "employer",
      viewedByReceiver: false,
    });

    return res.status(200).json({
      message: "Unread messages fetched successfully",
      totalMessages,
      totalPages: Math.ceil(totalMessages / pageSize),
      currentPage: pageNumber,
      messages,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getAllMessages = async (req, res) => {
  try {
    const { employerId, page = 1, limit = 10 } = req.query;
    if (!employerId) {
      return res.status(400).json({ message: "Employer ID is required" });
    }

    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const skip = (pageNumber - 1) * pageSize;

    const messages = await Message.aggregate([
      {
        $match: {
          receiverId: new mongoose.Types.ObjectId(employerId),
          receiverType: "employer",
        },
      },
      {
        $lookup: {
          from: "candidateprofiles", // Collection name
          localField: "senderId",
          foreignField: "_id", // Assuming userId in CandidateProfiles maps to senderId
          as: "candidateInfo",
        },
      },
      {
        $unwind: {
          path: "$candidateInfo",
          preserveNullAndEmptyArrays: true, // Keep even if no candidate profile exists
        },
      },
      {
        $project: {
          _id: 1,
          senderId: 1,
          senderType: 1,
          message: 1,
          createdAt: 1,
          viewedByEmployer: 1,
          profileHeadline: "$candidateInfo.profileHeadline",
          candidateName: "$candidateInfo.name",
        },
      },
      { $sort: { createdAt: -1 } }, // Latest messages first
      { $skip: skip },
      { $limit: pageSize },
    ]);

    // Total messages count for pagination
    const totalMessages = await Message.countDocuments({
      receiverId: employerId,
      receiverType: "employer",
    });

    return res.status(200).json({
      message: "All messages fetched successfully",
      totalMessages,
      totalPages: Math.ceil(totalMessages / pageSize),
      currentPage: pageNumber,
      messages,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const { employerId, candidateId } = req.query;

    if (!employerId || !candidateId) {
      return res
        .status(400)
        .json({ message: "Both employerId and candidateId are required" });
    }

    const messages = await Message.aggregate([
      {
        $match: {
          $or: [
            {
              senderId: new mongoose.Types.ObjectId(employerId),
              receiverId: new mongoose.Types.ObjectId(candidateId),
            },
            {
              senderId: new mongoose.Types.ObjectId(candidateId),
              receiverId: new mongoose.Types.ObjectId(employerId),
            },
          ],
        },
      },
      { $sort: { createdAt: -1 } }, // Sort latest to newest
      {
        $project: {
          _id: 1,
          senderId: 1,
          receiverId: 1,
          message: 1,
          createdAt: 1,
        },
      },
    ]);

    return res.status(200).json({
      message: "Chat history fetched successfully",
      totalMessages: messages.length,
      chatHistory: messages,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

//Activity Controllers
export const getCandidateActivity = async (req, res) => {};

export const getEmployerActivity = async (req, res) => {};
