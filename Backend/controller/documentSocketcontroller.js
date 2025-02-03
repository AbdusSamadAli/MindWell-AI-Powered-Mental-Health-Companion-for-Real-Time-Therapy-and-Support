const Document = require("../models/documentModel");
const authenticateuser = require("../middlewares/authMiddleware");
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
    throw error;
  }
};

const handleSocketEvents = (socket, io, userSocketMap) => {
  socket.on("get-document", async (documentId, token) => {
    console.log(`Received request for document: ${documentId}`);
    if (!documentId) {
      socket.emit("error", { message: "Invalid document ID." });
      return;
    }
    authenticateuser(socket, token, async (err, user) => {
      if (err) {
        socket.emit("error", { message: "Authentication failed" });
        return;
      }
      try {
        const document = await findOrCreateDocument(documentId);
        socket.join(documentId); 
        socket.documentId = documentId;
        console.log(`Client joined document room: ${documentId}`);
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
    console.log(`Broadcasting changes to room: ${documentId}`);
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
      console.log(`Document ${documentId} saved successfully.`);
      socket.to(documentId).emit("document-saved", updatedDocument);
    } catch (error) {
      console.error(`Error saving document ${documentId}:`, error);
    }
  });
};

module.exports = { handleSocketEvents };

