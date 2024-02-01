const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const connectDB = require("./config/db");

const PORT = process.env.PORT || 3000;

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/channels", require("./routes/channelRoutes"));
app.use("/api/messages", require("./routes/singleMessageRoutes"));
app.use("/api/directMessages", require("./routes/directMessagesRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));
app.get("/", (req, res) => {
  res.send("Welcome to the root URL!");
});

const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
});
