import express from "express";
import cookieParser from "cookie-parser";
import database from "./config/database.js";
import "dotenv/config";
import verifyRouter from "./routers/verify.js";
import newsRouter from "./routers/news.js";
import userRouter from "./routers/userRoute.js";
import postRouter from "./routers/postRoute.js";
import errorMiddleware from "./middlewares/error.js";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/public", express.static("public"));

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: "server/.env" });
}

// import route
app.use("/", verifyRouter);
app.use("/", newsRouter);
app.use("/", userRouter);
app.use("/", postRouter);

database();

app.listen(process.env.PORT, () =>
  console.log("server is running", process.env.PORT)
);

// error middleware
app.use(errorMiddleware);
