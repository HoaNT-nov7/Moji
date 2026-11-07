import { Server } from "socket.io";
import http from "http";
import express from "express";
import { socketMiddleware } from "../middlewares/socketMiddleware.js";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

io.use(socketMiddleware);

const onlineUsers = new Map();

io.on("connection", async (socket) => {
  const user = socket.user;

  console.log(`${user.displayName} online with socket : ${socket.id}`);
  onlineUsers.set(user._id, socket.id);

  io.emit("online-users", Array.from(onlineUsers.keys()));

  socket.on("disconnect", () => {
    onlineUsers.delete(user._id);
    io.emit("online-users", Array.from(onlineUsers.keys()));
    console.log(`socket disconnected: ${socket.id}`);
  });
});

export { io, app, server };
