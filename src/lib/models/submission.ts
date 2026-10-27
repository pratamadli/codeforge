import { Schema, model, models } from "mongoose";

const submissionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    problemId: { type: Schema.Types.ObjectId, ref: "Problem", required: true, index: true },
    code: { type: String, required: true },
    status: { type: String, enum: ["passed", "failed", "error"], required: true },
    testResults: { type: Schema.Types.Mixed, default: [] },
    runtimeMs: { type: Number, default: 0 },
    stdout: { type: String, default: "" },
    error: { type: String, default: "" },
  },
  { timestamps: true },
);

submissionSchema.index({ userId: 1, problemId: 1, createdAt: -1 });

export const Submission = models.Submission || model("Submission", submissionSchema);
