import express from "express";
import {
  getAthletes,
  getFilterOptions,
  getAthleteById,
  createAthlete,
  updateAthlete,
  deleteAthlete,
  bulkCreateAthletes, // Yeni fonksiyon
} from "../controllers/athleteController.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { restrictGuestUsers } from "../middlewares/restrictGuestUsers.js";

const router = express.Router();

router.get("/", getAthletes);
router.get("/filters", getFilterOptions);
router.get("/:id", getAthleteById);
router.post("/", isAuthenticated, restrictGuestUsers, createAthlete);
router.post("/bulk", isAuthenticated, restrictGuestUsers, bulkCreateAthletes); // Yeni route
router.put("/:id", isAuthenticated, restrictGuestUsers, updateAthlete);
router.delete("/:id", isAuthenticated, restrictGuestUsers, deleteAthlete);

export default router;
