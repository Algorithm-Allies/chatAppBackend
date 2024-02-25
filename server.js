const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const connectDB = require("./config/db");
const initializeSocket = require("./sockets/sockets");

const PORT = process.env.PORT || 3000;

connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: 'https://ripple-983hd6ber-mobins-projects.vercel.app',
}));
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

initializeSocket(server);
