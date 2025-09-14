const socket = require("socket.io");
const crypto = require("crypto");
const Chat = require("../models/chat");

const encryptSecretRoomId = ({ userId, targetUserId }) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("$"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    // handle diff types of event

    socket.on("joinChat", ({ firstName, userId, toUserId }) => {
      // Creating a room for two users to start the converstaion
      // creating roomId and two Users that will chat with each other should I have same room
      const roomId = [userId, toUserId].sort().join("$");
      console.log(`${firstName} joined a chat with roomId:- ${roomId}`);
      socket.join(roomId);
    });

    // function for sendMessage
    socket.on(
      "sendMessage",
      async ({ firstName, userId, toUserId, message: newMessage }) => {
        
        // Saving Message to DB
        try {
          const roomId = [userId, toUserId].sort().join("$");
          // console.log(`${firstName} joined a chat with roomId:- ${roomId}`);
          console.log(`${firstName} sending message:- ${newMessage}`);

          //
          let chat = await Chat.findOne({
            participants: { $all: [userId, toUserId] },
          });

          // Checking if there is existing chat between the 2 users, if there is no existing chat then create new message
          if (!chat) {
            chat = new Chat({
              participants: [userId, toUserId],
              messages: [],
            });
          }

          chat.messages.push({
            senderId: userId,
            text: newMessage,
          });

          await chat.save();
          io.to(roomId).emit("messageReceived", { firstName, newMessage });
        } catch (error) {
          console.log(error.message);
        }

      }
    );

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
