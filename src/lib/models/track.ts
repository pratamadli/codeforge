import { Schema, model, models } from "mongoose";

const trackSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    order: { type: Number, required: true },
  },
  { timestamps: true },
);

export const Track = models.Track || model("Track", trackSchema);
