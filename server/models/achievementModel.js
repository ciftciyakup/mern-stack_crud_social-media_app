import mongoose from "mongoose";
import { competitions, places, categories, allWeights } from "../utils/constants.js";

const AchievementSchema = new mongoose.Schema(
  {
    competition: {
      type: String,
      required: true,
    },
    place: {
      type: String,
      required: true,
    },
    athlete: {
      type: String,
      required: true,
      maxlength: 50,
    },
    category: {
      type: String,
      required: true,
    },
    weight: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
      maxlength: 50,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true, // Oluşturulma ve güncellenme zamanını otomatik ekler
  }
);

export default mongoose.model("Achievement", AchievementSchema);
