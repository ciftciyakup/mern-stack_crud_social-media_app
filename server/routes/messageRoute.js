import express from "express";
import { newMessage, getMessages } from "../controllers/messageController.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { restrictGuestUsers } from "../middlewares/restrictGuestUsers.js";

const router = express();

router
  .route("/newMessage")
  .post(isAuthenticated, restrictGuestUsers, newMessage);
router
  .route("/messages/:chatId")
  .get(isAuthenticated, restrictGuestUsers, getMessages);

export default router;
