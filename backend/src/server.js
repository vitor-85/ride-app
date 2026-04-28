import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { Server } from "socket.io";
import app from "./app.js";

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("🟢 Cliente conectado:", socket.id);
});

server.listen(3002, () => {
  console.log("🚀 Server rodando + Socket ativo");
});