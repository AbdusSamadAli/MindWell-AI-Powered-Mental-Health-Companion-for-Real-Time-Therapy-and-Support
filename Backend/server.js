require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/authRoute");
const messageRoutes = require("./routes/messageRoutes");
const { saveMessage } = require("./controller/messageController");
const initializeSocket = require('./sockets/socketHandlers');
const { handleSocketEvents } = require("./controller/documentSocketcontroller");
const connectDB = require("./config/db");
const app = express();
const server = http.createServer(app);

const frontendPath = path.join(__dirname, "../Frontend/dist");
app.use(express.static(frontendPath));
app.use(express.json());
connectDB();
app.use(cors({ origin: "*", methods: ["GET", "POST"], credentials: true }));

const io = socketIo(server, {
  cors: { origin: "*", methods: ["GET", "POST"], credentials: true },
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.post("/api/logout", (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
});
initializeSocket(io);
const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  socket.on("registerUser", (userId) => {
    if (!userSocketMap[userId]) {
      userSocketMap[userId] = [];
    }
    userSocketMap[userId].push(socket.id);
    console.log(`User ${userId} registered with socket ID: ${socket.id}`);
  });

  socket.on("sendMessage", async (message) => {
    console.log("Message received:", message);
    try {
      const savedMessage = await saveMessage(message);
      if (savedMessage) {
        message.recipients.forEach((recipientId) => {
          const recipientSockets = userSocketMap[recipientId];
          if (recipientSockets) {
            recipientSockets.forEach((socketId) => {
              io.to(socketId).emit("receiveMessage", {
                text: message.text,
                sender: message.sender,
                recipients: message.recipients,
                timestamp: message.timestamp,
              });
            });
          }
        });
      } else {
        console.log("Duplicate message, not broadcasting.");
      }
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  handleSocketEvents(socket, io, userSocketMap);

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
    for (const userId in userSocketMap) {
      const index = userSocketMap[userId].indexOf(socket.id);
      if (index !== -1) {
        userSocketMap[userId].splice(index, 1);
        console.log(`Removed socket ID ${socket.id} from user ${userId}`);
        if (userSocketMap[userId].length === 0) {
          delete userSocketMap[userId];
          console.log(`Removed user ${userId} from userSocketMap`);
        }
        break;
      }
    }
  });
});

app.get("*", (_, res) => {
  res.sendFile(path.resolve(frontendPath, "index.html"));
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
