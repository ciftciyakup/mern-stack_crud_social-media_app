import express from "express";
import {
  createAchievement,
  getAchievements,
  updateAchievement,
  deleteAchievement,
  getFilterOptions,
} from "../controllers/achievementController.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { restrictGuestUsers } from "../middlewares/restrictGuestUsers.js";

const router = express.Router();

router
  .route("/achievements")
  .post(isAuthenticated, restrictGuestUsers, createAchievement)
  .get(getAchievements);

router.route("/achievements/filters").get(getFilterOptions);

router
  .route("/achievements/:id")
  .put(isAuthenticated, restrictGuestUsers, updateAchievement)
  .delete(isAuthenticated, restrictGuestUsers, deleteAchievement);

export default router;
