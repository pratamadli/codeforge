import { Schema, model, models } from "mongoose";

const testCaseSchema = new Schema(
  {
    args: { type: [Schema.Types.Mixed], required: true },
    expected: { type: Schema.Types.Mixed, required: true },
  },
  { _id: false },
);

const problemSchema = new Schema(
  {
    moduleId: { type: Schema.Types.ObjectId, ref: "Module", required: true, index: true },
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    prompt: { type: String, required: true },
    starterCode: { type: String, required: true },
    language: { type: String, enum: ["js", "ts"], required: true },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], required: true },
    skillLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
    functionName: { type: String, required: true },
    sampleTests: { type: [testCaseSchema], default: [] },
    hiddenTests: { type: [testCaseSchema], default: [] },
    pembahasan: { type: String, required: true },
    tags: { type: [String], default: [] },
    order: { type: Number, required: true },
  },
  { timestamps: true },
);

export const Problem = models.Problem || model("Problem", problemSchema);
