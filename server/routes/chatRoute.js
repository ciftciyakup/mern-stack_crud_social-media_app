import express from "express";
import { newChat, getChats } from "../controllers/chatController.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { restrictGuestUsers } from "../middlewares/restrictGuestUsers.js";

const router = express();

router.route("/newChat").post(isAuthenticated, restrictGuestUsers, newChat);
router.route("/chats").get(isAuthenticated, getChats);

export default router;
