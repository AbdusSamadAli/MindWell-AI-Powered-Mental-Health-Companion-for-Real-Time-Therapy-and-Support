import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { Link } from "react-router-dom";
const socket = io("/", {
  transports: ["websocket"],
  withCredentials: true,
});

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/users", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const fetchMessages = async () => {
      try {
        const response = await axios.get("/api/messages", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchUsers();
    fetchMessages();
    const userId = localStorage.getItem("userId"); 
    if (userId) {
      socket.emit("registerUser", userId);
    }
    const receiveMessageHandler = (message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: message.text,
          sender: message.sender, 
          timestamp: message.timestamp,
        },
      ]);
    };

    socket.on("receiveMessage", receiveMessageHandler);

    return () => {
      socket.off("receiveMessage", receiveMessageHandler);
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() === "" || selectedUsers.length === 0) {
      alert("Please select users and enter a message.");
      return;
    }

    const messageData = {
      text: message,
      sender: {
        _id: localStorage.getItem("userId"),
        username: localStorage.getItem("username"), 
      },
      recipients: selectedUsers,
      timestamp: new Date(),
    };
    socket.emit("sendMessage", messageData);
    setMessage("");
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <div className="chat-container p-4">
      <h2 className="text-xl font-bold">Chat Room</h2>
      <div className="user-selection mt-4">
        <h3>Select Users for Chat:</h3>
        <p>Not seeing any Users? Login First!</p>
        <Link
              to="/login"
              className="text-black hover:underline"
            >
              Login
            </Link>
        {users.map((user) => (
          <div key={user._id} className="flex items-center">
            <input
              type="checkbox"
              checked={selectedUsers.includes(user._id)}
              onChange={() => toggleUserSelection(user._id)}
              className="mr-2"
            />
            <span>{user.username}</span> 
          </div>
        ))}
      </div>
      <div className="messages mt-4 border p-2 h-60 overflow-auto">
        {messages.map((msg, index) => (
          <div key={index} className="message mb-2">
            <strong>{msg.sender?.username || "Unknown User"}</strong>:{" "}
            {msg.text || "No message content"}
          </div>
        ))}
      </div>

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message here..."
        className="border p-2 mt-2 w-full"
      />
      <button
        className="bg-blue-500 text-white p-2 rounded mt-2"
        onClick={sendMessage}
      >
        Send
      </button>
    </div>
  );
};

export default Chat;
