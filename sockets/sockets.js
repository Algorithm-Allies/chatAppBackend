const socketIO = require("socket.io");
const jwt = require("jsonwebtoken");
const Chat = require("../models/chatModal.js");
const Message = require("../models/messageModel.js");
const User = require("../models/userModel.js");

function initializeSocket(server) {
  const io = socketIO(server, {
    pingTimeout: 60000,
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
          chat: chatId,
        });

        chat.messages.push(newMessage);
        await chat.save();

        // After saving to the database emit the message to all connected clients
        io.emit("newMessage", {
          _id: newMessage._id,
          text: newMessage.text,
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
  });
}

module.exports = initializeSocket;
