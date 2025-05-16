import mongoose from "mongoose";

const mcqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: [String] },
    skillName: {
      type: String,
    },
  },
  { timestamps: true }
);

export const MCQ = mongoose.model("MCQ", mcqSchema);

export const createMCQ = async (req, res) => {
  try {
    const data = req.body;
    for (let i of data) {
      const { question, options, correctAnswer, skillName } = i;

      if (!question || !options || !correctAnswer || !skillName) {
        return res
          .status(400)
          .json({ success: false, message: "All fields are required." });
      }

      await MCQ.create({ question, options, correctAnswer, skillName });
    }
    res.status(201).json({ success: true, message: "MCQ created" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const updateMCQ = async (req, res) => {
  try {
    const { skillName } = req.query;
    const updates = req.body;

    for (let i of updates) {
      await MCQ.findOneAndUpdate(
        { skillName: skillName },
        { $set: i },
        {
          new: true,
        }
      );
    }

    res.status(200).json({ success: true, message: "MCQ updated" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error updating MCQ",
      error: err.message,
    });
  }
};

export const updateSkillName = async (req, res) => {
  try {
    const { skillName, newskillName } = req.query;

    await MCQ.findOneAndUpdate(
      { skillName: skillName },
      { $set: { skillName: newskillName } },
      {
        new: true,
      }
    );

    res.status(200).json({ success: true, message: "MCQ updated" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error updating MCQ",
      error: err.message,
    });
  }
};

export const getMCQs = async (req, res) => {
  try {
    const { skillName } = req.query;

    const matchStage = { $match: {} };

    if (skillName)
      matchStage.$match.skillName = { $regex: skillName, $options: "i" };

    console.log(matchStage);

    const mcqs = await MCQ.aggregate([matchStage]);

    res
      .status(200)
      .json({ success: true, message: "MCQs fetched", data: mcqs });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching MCQs",
      error: err.message,
    });
  }
};
