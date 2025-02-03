require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const authRoutes = require("./routes/authRoute");
const messageRoutes = require("./routes/messageRoutes");
const connectDB = require("./config/db");
const Document = require("./models/documentModel"); 
const messageController = require("./controller/messageController");
const authenticateuser = require("./middlewares/authMiddleware");

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
connectDB();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  socket.on("registerUser", (userId) => {
    if (!userId) return;
    userSocketMap[userId] = socket.id;
    console.log(`User ${userId} registered with socket ${socket.id}`);
  });
  socket.on("get-document", (documentId, token) => {
    console.log(`User ${socket.id} requested document ${documentId}`);
    authenticateuser(socket, token, async (err, user) => {
      if (err) return socket.emit("error", { message: "Authentication failed" });
      try {
        let document = await Document.findById(documentId);
        if (!document) {
          document = new Document({ _id: documentId, data: {} });
          await document.save();
        }
        socket.join(documentId); 
        socket.documentId = documentId;
        socket.emit("load-document", document.data);
      } catch (error) {
        console.error("Error retrieving document:", error);
        socket.emit("error", { message: "Error retrieving document." });
      }
    });
  });
  socket.on("send-changes", (delta) => {
    const documentId = socket.documentId;
    if (!documentId || !delta) return;
    console.log(`Broadcasting changes to document ${documentId}`);
    socket.to(documentId).emit("receive-changes", delta);  
  });

  socket.on("save-document", async (data) => {
    const documentId = socket.documentId;
    if (!documentId) return;

    try {
      const updatedDocument = await Document.findByIdAndUpdate(
        documentId,
        { data },
        { new: true }
      );
      console.log(`Document ${documentId} saved.`);
      socket.to(documentId).emit("document-saved", updatedDocument); 
    } catch (error) {
      console.error(`Error saving document ${documentId}:`, error);
    }
  });
  socket.on("sendMessage", async (message, callback) => {
    console.log("Received message:", message);
    if (!message.sender || !message.recipients || !message.text) {
      return callback({ status: "error", message: "Missing fields." });
    }
    await messageController.socketHandler(io, message, userSocketMap);
    callback({ status: "ok" });
  });
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    for (let userId in userSocketMap) {
      if (userSocketMap[userId] === socket.id) {
        delete userSocketMap[userId];
      }
    }
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

server.listen(8080, () => {
  console.log("Server is running on port 8080");
});
