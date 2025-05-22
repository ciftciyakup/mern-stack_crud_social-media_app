import express from "express";
import multer from "multer";
import {
  getAllTournaments,
  getTournamentByUrl,
  createTournament,
  updateTournament,
  deleteTournament,
} from "../controllers/tournamentController.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { restrictGuestUsers } from "../middlewares/restrictGuestUsers.js";
import slugify from "slugify";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/tournaments/");
  },
  filename: (req, file, cb) => {
    const originalName = Buffer.from(file.originalname, "latin1").toString("utf8");
    const nameWithoutExtension = originalName.split(".").slice(0, -1).join(".");
    const extension = originalName.split(".").pop();
    const slugifiedName = slugify(nameWithoutExtension);
    cb(null, `${Date.now()}-${slugifiedName}.${extension}`);
  },
});

const upload = multer({ storage });

router.get("/", getAllTournaments);
router.get("/:url", getTournamentByUrl);
router.post(
  "/",
  isAuthenticated,
  restrictGuestUsers,
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "regulation", maxCount: 1 },
    { name: "top7", maxCount: 1 },
    { name: "results", maxCount: 1 },
  ]),
  createTournament
);
router.put(
  "/:id",
  isAuthenticated,
  restrictGuestUsers,
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "video", maxCount: 1 },
    { name: "regulation", maxCount: 1 },
    { name: "top7", maxCount: 1 },
    { name: "results", maxCount: 1 },
  ]),
  updateTournament
);
router.delete("/:id", isAuthenticated, restrictGuestUsers, deleteTournament);

export default router;
