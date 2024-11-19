const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const app = express();
const server = http.createServer(app);
const path = require("path");
const defaultValue = "<p>Initial content goes here...</p>";

app.use(express.json());
const buildPath = path.join(__dirname, "../Frontend/dist");
app.use(express.static(buildPath));
app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});
async function findOrCreateDocument(documentId) {
  try {
    let document = await Document.findById(documentId); 
    if (!document) {
      document = await Document.create({ _id: documentId, data: {} }); 
    }
    return document;
  } catch (error) {
    console.error(`Error finding or creating document:`, error);
    throw error;
  }
}

const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const mongoURI = process.env.MONGODB_URI;

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const UserModel = mongoose.model("User", UserSchema);
const MessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  recipients: { type: [String], required: true }, 
  text: { type: String, required: true }, 
  timestamp: { type: Date, default: Date.now },
});

const MessageModel = mongoose.model("Message", MessageSchema);

const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.get("/api/users", authenticateJWT, async (req, res) => {
  try {
    const users = await UserModel.find({}, { password: 0 }); 
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/signup", async (req, res) => {
  const { username, email, password } = req.body;

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);


  const newUser = new UserModel({ username, email, password: hashedPassword });
  await newUser.save();

  res.status(201).json({ message: "User created successfully" });
});

const createToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = createToken(user);

    res.status(200).json({ token, userId: user._id });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});
app.get("/api/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await UserModel.findById(userId, { username: 1 }); 
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ username: user.username });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});


app.get("/api/messages", authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;
    const messages = await MessageModel.find({
      recipients: userId,
    })
      .populate("sender", "username") 
      .populate("recipients", "username"); 

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});
app.post("/api/logout", (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
});
const DocumentSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  data: {
    type: Object,
    required: true,
  },
});
const Document = mongoose.model("Document", DocumentSchema);
app.post("/api/documents", authenticateJWT, async (req, res) => {
  const { id, data } = req.body;

  try {
    const document = await Document.findOneAndUpdate(
      { id },
      { data },
      { upsert: true, new: true }
    );
    res.status(200).json({ message: "Document saved successfully", document });
  } catch (error) {
    console.error("Error saving document:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
const userSocketMap = {};
app.use(cors());

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
      const existingMessage = await MessageModel.findOne({
        text: message.text,
        sender: message.sender,
        recipients: { $all: message.recipients },
      });

      if (!existingMessage) {
        const newMessage = new MessageModel(message);
        await newMessage.save();
        if (Array.isArray(message.recipients) && message.recipients.length > 0) {
          message.recipients.forEach((recipientId) => {
            const recipientSocketId = userSocketMap[recipientId];
            if (recipientSocketId) {
              io.to(recipientSocketId).emit("receiveMessage", {
                text: message.text,
                sender: message.sender,  
                recipients: message.recipients,
                timestamp: message.timestamp,
              });
            }
          });
        }
      } else {
        console.log("Duplicate message, not saving:", message);
      }
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });
  
  socket.on("get-document", async (documentId) => {
    if (!documentId) {
      console.error("Received null or undefined documentId.");
      socket.emit("error", { message: "Invalid document ID." });
      return;
    }

    try {
      const document = await findOrCreateDocument(documentId);
      if (!document) {
        console.error(
          `Document with ID ${documentId} not found or couldn't be created.`
        );
        socket.emit("error", {
          message: "Document not found or couldn't be created.",
        });
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
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
