import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import axios from "axios";

const Chat = () => {
  const [messages, setMessages] = useState([]);

  const [newMessage, setNewMessage] = useState("");

  // webSocket code
  const { toUserId } = useParams();
  const user = useSelector((store) => store?.user);
  const userId = user?._id;
  const firstName = user?.firstName;
  //   console.log("fromUserId", userId + " toUserId ", toUserId);
  console.log("messages", messages);

  // fetching chat Message
  const fetchMessages = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/chat/${toUserId}`, {
        withCredentials: true,
      });

      console.log("chat-messages", res?.data?.messages);

      if (res?.data?.data?.messages) {
        console.log("inside-if");

        const chatMessages = res?.data?.data?.messages?.map((message) => {
          console.log("single-message", message);

          const { senderId, text } = message;
          return {
            firstName: senderId?.firstName,
            text,
          };
        });

        setMessages(chatMessages);
      }
    } catch (error) {
      console.log("error fetching chat messages", error.message);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    /**
     * Creating webssocket connection to start a conversation
     */

    if (!userId) return;
    const socket = createSocketConnection();
    socket.emit("joinChat", { firstName, userId, toUserId });

    // function for calling when message is received
    socket.on("messageReceived", ({ firstName, newMessage }) => {
      console.log(`${firstName} : ${newMessage}`);
      setMessages((messages) => [...messages, { firstName, newMessage }]);
    });
  }, [userId, toUserId]);

  //
  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    //
    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      firstName,
      userId,
      toUserId,
      message: newMessage,
    });
    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-[80vh] max-w-2xl mx-auto my-10 border rounded-xl shadow-lg">
      {/* Chat Header */}
      <div className="p-4 bg-base-200 rounded-t-xl flex items-center justify-between">
        <h2 className="font-bold text-xl">Chat</h2>
        <span className="badge badge-success">Online</span>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-base-100">
        {messages.map((msg, index) => {
          return (
            <div
              key={index}
              className={
                "chat " +
                (user?.firstName === msg?.firstName ? "chat-end" : "chat-start")
              }
            >
              <div className="chat-header">
                {`${msg.firstName}  ${msg.lastName}`}
                <time className="text-xs opacity-50"> 2 hours ago</time>
              </div>
              <div className="chat-bubble">{msg.text}</div>
              <div className="chat-footer opacity-50">Seen</div>
            </div>
          );
        })}
      </div>

      {/* Chat Input */}
      <form
        onSubmit={sendMessage}
        className="p-4 bg-base-200 rounded-b-xl flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Type a message..."
          className="input input-bordered w-full"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button className="btn btn-primary" type="submit">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
