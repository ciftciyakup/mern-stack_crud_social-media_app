import mongoose from "mongoose";

const athleteSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  birthDate: Date,
  gender: { type: String, enum: ["Erkek", "Kadın"] },
  country: String,
  city: String,
  club: String,
  category: String,
  weightClass: String,
  tournamentId: { type: mongoose.Schema.Types.ObjectId, ref: "Tournament" },
  coachId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Athlete = mongoose.model("Athlete", athleteSchema);

export default Athlete;
