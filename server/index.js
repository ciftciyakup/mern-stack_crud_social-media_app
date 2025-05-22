import express from "express";
import cookieParser from "cookie-parser";
import database from "./config/database.js";
import "dotenv/config";
import verifyRoutes from "./routes/verify.js";
import newsRoutes from "./routes/news.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import achievementRoutes from "./routes/achievementRoutes.js";
import chatRoutes from "./routes/chatRoute.js";
import messageRoutes from "./routes/messageRoute.js";
import tournamentRoutes from "./routes/tournamentRoutes.js";
import athleteRoutes from "./routes/athleteRoutes.js";
import errorMiddleware from "./middlewares/error.js";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { Server } from "socket.io";

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
app.use("/", verifyRoutes);
app.use("/", newsRoutes);
app.use("/", userRoutes);
app.use("/", postRoutes);
app.use("/", achievementRoutes);
app.use("/", chatRoutes);
app.use("/", messageRoutes);
app.use("/tournaments", tournamentRoutes);
app.use("/athletes", athleteRoutes);

database();

const server = app.listen(process.env.PORT, () =>
  console.log("server is running", process.env.PORT)
);

// deployment
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Server is Running! 🚀");
  });
}

// error middleware
app.use(errorMiddleware);

const io = new Server(server, {
  // pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) && users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  console.log("🚀 Someone connected!");
  // console.log(users);

  // get userId and socketId from client
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  // get and send message
  socket.on("sendMessage", ({ senderId, receiverId, content }) => {
    const user = getUser(receiverId);
    io.to(user?.socketId).emit("getMessage", {
      senderId,
      content,
    });
  });

  // typing states
  socket.on("typing", ({ senderId, receiverId }) => {
    const user = getUser(receiverId);
    console.log(user);
    io.to(user?.socketId).emit("typing", senderId);
  });

  socket.on("typing stop", ({ senderId, receiverId }) => {
    const user = getUser(receiverId);
    io.to(user?.socketId).emit("typing stop", senderId);
  });

  // user disconnected
  socket.on("disconnect", () => {
    console.log("⚠️ Someone disconnected");
    removeUser(socket.id);
    io.emit("getUsers", users);
    // console.log(users);
  });
});
