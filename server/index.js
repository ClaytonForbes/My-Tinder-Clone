const express = require("express");
const http = require("http");
const cors = require("cors");
require("dotenv").config();

const { connectDB } = require("./config/db");

const app = express();

// ---------------- MIDDLEWARE ----------------
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use(express.json());

// ---------------- HTTP SERVER ----------------
const server = http.createServer(app);

// ---------------- SOCKET SETUP ----------------
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Online user map: userId → socketId
const onlineUsers = new Map();

// ---------------- SOCKET LOGIC ----------------
io.on("connection", (socket) => {
  console.log("🟢 Connected:", socket.id);

  socket.on("join", (userId) => {
    if (!userId) return;
    socket.userId = userId;
    onlineUsers.set(userId, socket.id);
    console.log("👤 User joined:", userId);
  });

  socket.on("send_message", ({ toUserId, message, fromUserId }) => {
    if (!toUserId || !message) return;
    const targetSocketId = onlineUsers.get(toUserId);
    if (targetSocketId) {
      io.to(targetSocketId).emit("receive_message", {
        fromUserId,
        toUserId,
        message,
      });
    }
  });

  socket.on("disconnect", () => {
    const userId = socket.userId;
    if (userId) {
      onlineUsers.delete(userId);
      console.log("🔴 Removed user:", userId);
    }
    console.log("🔴 Disconnected:", socket.id);
  });
});

// ---------------- ROUTES ----------------
// Auth routes at root level (signup/login)
app.use("/", require("./routes/authRoutes"));

// API routes
app.use("/api/swipes", require("./routes/swipeRoutes"));
app.use("/api/matches", require("./routes/matchRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.path} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Unhandled error:", err);
  res.status(500).json({ message: "Internal server error" });
});

// ---------------- START SERVER ----------------
connectDB()
  .then(() => {
    server.listen(8000, () => {
      console.log("🚀 Server running on port 8000");
    });
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err);
    process.exit(1);
  });