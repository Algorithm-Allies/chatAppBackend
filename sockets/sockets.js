const socketIO = require("socket.io");
const jwt = require("jsonwebtoken");
const Chat = require("../models/chatModal.js");
const Message = require("../models/messageModel.js");
const User = require("../models/userModel.js");

function initializeSocket(server) {
  const io = socketIO(server, {
    pingTimeout: 60000,
    cors: {
      origin: "*", // Change this to your desired origin, or specific origins
      methods: ["GET", "POST"], // Add methods you want to allow
      allowedHeaders: ["Authorization"], // Add headers you want to allow
      credentials: true, // Set to true if you want to allow credentials (cookies, authorization headers, etc.)
    },
  });

  io.on("connection", (socket) => {
    const token = socket.handshake.auth.token;

    socket.on("sendMessage", async (data) => {
      console.log(data);
      // Save the message data to the database here
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        const { chatId, text } = data; //May need to add more data here

        const chat = await Chat.findById(chatId);

        if (!chat) {
          return console.error("Chat not found");
        }

        const user = await User.findById(userId);

        const newMessage = await Message.create({
          user: userId,
          text,
          chatId: chatId,
        });

        chat.messages.push(newMessage);
        await chat.save();

        // After saving to the database emit the message to all connected clients
        io.emit("newMessage", {
          _id: newMessage._id,
          text: newMessage.text,
          chatId: chatId,
          createdAt: newMessage.createdAt,
          updatedAt: newMessage.updatedAt,
          user: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            profilePhoto: user.profilePhoto,
          },
        });
      } catch (error) {
        console.error("Error saving message to the database:", error);
      }
    });

    socket.on("editMessage", async (data) => {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        const { messageId, newText } = data;

        // Update the message in the database
        const updatedMessage = await Message.findByIdAndUpdate(
          messageId,
          { text: newText },
          { new: true }
        ).populate("user", "firstName lastName profilePhoto");

        if (!updatedMessage) {
          console.error("Message not found");
          return;
        }

        // Emit the updated message to all connected clients
        io.emit("messageEdited", updatedMessage);
      } catch (error) {
        console.error("Error editing message:", error);
      }
    });

    socket.on("deleteMessage", async (messageId) => {
      try {
        // Delete the message from the database
        const deletedMessage = await Message.findByIdAndDelete(messageId);

        if (!deletedMessage) {
          console.error("Message not found");
          return;
        }

        // Emit the deleted message ID to all connected clients
        io.emit("messageDeleted", messageId);
      } catch (error) {
        console.error("Error deleting message:", error);
      }
    });
  });
}

module.exports = initializeSocket;
