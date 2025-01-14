const Document = require('../models/documentModel');  

const findOrCreateDocument = async (documentId) => {
  try {
    let document = await Document.findById(documentId);
    if (!document) {
      document = new Document({ _id: documentId, data: {} }); 
      await document.save();
    }
    return document;
  } catch (error) {
    console.error("Error finding or creating document:", error);
    return null;
  }
};

const handleSocketEvents = (socket, io, userSocketMap) => {
  socket.on("get-document", async (documentId) => {
    if (!documentId) {
      console.error("Received null or undefined documentId.");
      socket.emit("error", { message: "Invalid document ID." });
      return;
    }

    try {
      const document = await findOrCreateDocument(documentId);
      if (!document) {
        console.error(`Document with ID ${documentId} not found or couldn't be created.`);
        socket.emit("error", { message: "Document not found or couldn't be created." });
        return;
      }
      socket.join(documentId); 
      console.log(`Client joined document room: ${documentId}`);
      socket.emit("load-document", document.data);
    } catch (error) {
      console.error("Error in get-document:", error);
      socket.emit("error", { message: "Error retrieving document." });
    }
  });

  socket.on("save-document", async (data) => {
    const documentId = socket.handshake.query.documentId;
    try {
      await Document.findOneAndUpdate({ _id: documentId }, { data });
      console.log(`Document with ID ${documentId} saved successfully.`);
    } catch (error) {
      console.error(`Error saving document with ID ${documentId}:`, error);
      socket.emit("error", { message: "Error saving document." });
    }
  });

  socket.on("send-changes", (delta) => {
    const documentId = socket.handshake.query.documentId;
    socket.to(documentId).emit("receive-changes", delta); 
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
};

module.exports = { handleSocketEvents };
