const mongoose = require("mongoose");

const analysisResultSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    role_id: {
      type: String,
      required: true,
    },
    role_title: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    matched_count: {
      type: Number,
      default: 0,
    },
    total_count: {
      type: Number,
      default: 0,
    },
    missing_skills: {
      type: [String],
      default: [],
    },
    matched_skills: {
      type: [String],
      default: [],
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

analysisResultSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    return ret;
  },
});

module.exports =
  mongoose.models.AnalysisResult ||
  mongoose.model("AnalysisResult", analysisResultSchema);
