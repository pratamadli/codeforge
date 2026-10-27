import { Schema, model, models } from "mongoose";

const lessonSchema = new Schema(
  {
    moduleId: { type: Schema.Types.ObjectId, ref: "Module", required: true, index: true },
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    markdown: { type: String, required: true },
    order: { type: Number, required: true },
  },
  { timestamps: true },
);

export const Lesson = models.Lesson || model("Lesson", lessonSchema);
