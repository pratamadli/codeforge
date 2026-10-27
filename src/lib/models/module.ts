import { Schema, model, models } from "mongoose";

const moduleSchema = new Schema(
  {
    trackId: { type: Schema.Types.ObjectId, ref: "Track", required: true, index: true },
    slug: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    order: { type: Number, required: true },
  },
  { timestamps: true },
);

moduleSchema.index({ trackId: 1, slug: 1 }, { unique: true });

export const Module = models.Module || model("Module", moduleSchema);
