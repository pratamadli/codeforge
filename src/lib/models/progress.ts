import { Schema, model, models } from "mongoose";

const problemProgressSchema = new Schema(
  {
    problemId: { type: Schema.Types.ObjectId, ref: "Problem", required: true },
    slug: { type: String, required: true },
    status: { type: String, enum: ["attempted", "solved"], required: true },
    attempts: { type: Number, default: 0 },
  },
  { _id: false },
);

const progressSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    completedLessonIds: {
      type: [{ type: Schema.Types.ObjectId, ref: "Lesson" }],
      default: [],
    },
    problems: { type: [problemProgressSchema], default: [] },
  },
  { timestamps: true },
);

export const Progress = models.Progress || model("Progress", progressSchema);
