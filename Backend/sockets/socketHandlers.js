const userSocketMap = {};
const { saveMessage } = require("../controller/messageController");
function initializeSocket(io) {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("registerUser", (userId) => {
      if (!userSocketMap[userId]) userSocketMap[userId] = [];
      userSocketMap[userId].push(socket.id);
    });

    socket.on("disconnect", () => {
      for (const userId in userSocketMap) {
        const index = userSocketMap[userId].indexOf(socket.id);
        if (index !== -1) userSocketMap[userId].splice(index, 1);
      }
    });
  });
}

module.exports = (io) => {
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
};

module.exports = initializeSocket;
