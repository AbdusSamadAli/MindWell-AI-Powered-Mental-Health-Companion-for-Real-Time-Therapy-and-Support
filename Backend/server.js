require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoute");
const messageRoutes = require("./routes/messageRoutes");
const messageController = require("./controller/messageController");
const appointmentroute = require("./routes/appointments");
const aiRoute = require("./routes/aiRoutes");
const { createAdapter } = require("@socket.io/redis-adapter");
const { createClient } = require("ioredis");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  },
});

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "DELETE", "PUT"],
  credentials: true,
}));

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/appointments", appointmentroute);
app.use("/api/ai", aiRoute);

const pubClient = createClient({ host: "127.0.0.1", port: 6379 });
const subClient = pubClient.duplicate();
io.adapter(createAdapter(pubClient, subClient));
const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  socket.on("registerUser", (userId) => {
    userSocketMap[userId] = socket.id;
    console.log(`User ${userId} registered with socket ${socket.id}`);
  });
  socket.on("sendMessage", async (message, callback) => {
    console.log("Received message:", message);
    if (!message.sender || !message.recipients || !message.text) {
      return callback({ status: "error", message: "Missing fields." });
    }
    await messageController.socketHandler(io, message, userSocketMap);
    callback({ status: "ok" });
  });

  const roomUsers = {};
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    socket.on("join-room", (roomId, userId) => {
      socket.join(roomId);
      roomUsers[socket.id] = { roomId, userId };
      socket.to(roomId).emit("user-connected", userId);
      socket.on("disconnect", () => {
        const { roomId, userId } = roomUsers[socket.id] || {};
        if (roomId && userId) {
          socket.to(roomId).emit("user-disconnected", userId);
        }
        delete roomUsers[socket.id];
      });
    });
  
    socket.on("offer", (data) => {
      const { roomId } = roomUsers[socket.id] || {};
      if (roomId) socket.to(roomId).emit("offer", data);
    });
  
    socket.on("answer", (data) => {
      const { roomId } = roomUsers[socket.id] || {};
      if (roomId) socket.to(roomId).emit("answer", data);
    });
  
    socket.on("ice-candidate", (data) => {
      const { roomId } = roomUsers[socket.id] || {};
      if (roomId) socket.to(roomId).emit("ice-candidate", data);
    });
  });  
});
const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} with Redis adapter`);
});

