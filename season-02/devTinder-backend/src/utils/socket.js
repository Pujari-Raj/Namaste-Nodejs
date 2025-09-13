const socket = require("socket.io");
const crypto = require("crypto")

const encryptSecretRoomId = ({userId, targetUserId}) => {
  return crypto.createHash("sha256").update([ userId, targetUserId].sort().join("$")).digest("hex")
}

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

    socket.on(
      "sendMessage",
      ({ firstName, userId, toUserId, message: newMessage }) => {
        const roomId = [userId, toUserId].sort().join("$");
        // console.log(`${firstName} joined a chat with roomId:- ${roomId}`);
        console.log(`${firstName} sending message:- ${newMessage}`);
        
        io.to(roomId).emit("messageReceived", { firstName, newMessage });
      }
    );

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
