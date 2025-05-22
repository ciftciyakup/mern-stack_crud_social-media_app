import mongoose from "mongoose";

const tournamentSchema = new mongoose.Schema({
  name: String,
  url: { type: String, unique: true },
  startDate: Date,
  endDate: Date,
  photo: String,
  video: String,
  isCompleted: Boolean,
  photoArchiveUrl: String,
  regulationUrl: String,
  top7Url: String,
  resultsUrl: String,
  athletes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Athlete" }],
  coaches: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const Tournament = mongoose.model("Tournament", tournamentSchema);

export default Tournament;
