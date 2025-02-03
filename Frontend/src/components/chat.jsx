import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:8080", {
  transports: ["websocket"],
  withCredentials: true,
});

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const [sendingMessage, setSendingMessage] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editedMessage, setEditedMessage] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/auth/users", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error.message);
      }
    };
    fetchUsers();

    if (userId) {
      socket.emit("registerUser", userId);
    }

    const receiveMessageHandler = (message) => {
      if (message.sender === selectedUser || (message.recipients && Array.isArray(message.recipients) && message.recipients.includes(userId))) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    };
    socket.on("messageReceived", receiveMessageHandler);

    return () => {
      socket.off("messageReceived", receiveMessageHandler);
    };
  }, [selectedUser, userId]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser) return;
      try {
        const response = await axios.get(
          `http://localhost:8080/api/messages/${userId}/${selectedUser}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error.message);
      }
    };
    fetchMessages();
  }, [selectedUser]);

  const sendMessage = () => {
    if (sendingMessage || message.trim() === "" || selectedUser === null) {
      alert("Please select a user and enter a message.");
      return;
    }

    setSendingMessage(true);

    const senderId = localStorage.getItem("userId");
    const senderUsername = localStorage.getItem("username");

    if (!senderId || !senderUsername) {
      console.error("User ID or username is missing.");
      setSendingMessage(false);
      return;
    }

    const recipientId = selectedUser;
    if (!recipientId) {
      console.error("No recipient selected.");
      setSendingMessage(false);
      return;
    }

    const messageData = {
      text: message.trim(),
      sender: senderId,
      senderUsername: senderUsername,
      recipients: [recipientId],
      timestamp: new Date(),
    };

    socket.emit("sendMessage", messageData, (response) => {
      if (response.status === "ok") {
        setMessages((prevMessages) => [...prevMessages, { ...messageData }]);
      } else {
        console.error("Message failed to send:", response.message || response.error);
      }
      setSendingMessage(false);
    });

    setMessage("");
  };
  const updateMessage = async (messageId) => {
    if (editedMessage.trim() === "") {
      alert("Message cannot be empty.");
      return;
    }
    try {
      console.log(`Updating message with ID: ${messageId}`);
      const response = await axios.put(
        `http://localhost:8080/api/messages/${messageId}`,
        { text: editedMessage },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === messageId ? { ...msg, text: editedMessage } : msg
        )
      );
      setEditingMessageId(null);
      setEditedMessage("");
      console.log(response.data.message);
    } catch (error) {
      console.error("Error updating message:", error.message);
    }
  };  

  const deleteMessage = async (messageId) => {
    try {
      await axios.delete(`http://localhost:8080/api/messages/${messageId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setMessages((prevMessages) => prevMessages.filter((msg) => msg._id !== messageId));
    } catch (error) {
      console.error("Error deleting message:", error.response?.data || error.message);
    }
  };  

  return (
    <div className="chat-container p-4">
      <h2 className="text-xl font-bold">Chat Room</h2>
      <div className="user-selection mt-4">
        <h3>Select a User to Chat With:</h3>
        {users.map(
          (user) =>
            user._id !== userId && (
              <div key={user._id} className="flex items-center">
                <input
                  type="radio"
                  checked={selectedUser === user._id}
                  onChange={() => setSelectedUser(user._id)}
                  className="mr-2"
                />
                <span>{user.username}</span>
              </div>
            )
        )}
      </div>
      <div className="messages mt-4 border p-2 h-60 overflow-auto">
        {messages.map((msg) => (
          <div key={msg._id} className="message mb-2 flex justify-between items-center">
            {editingMessageId === msg._id ? (
              <input
                type="text"
                value={editedMessage}
                onChange={(e) => setEditedMessage(e.target.value)}
                className="border p-1"
              />
            ) : (
              <span>
                <strong>{msg.senderUsername || "Unknown User"}</strong>: {msg.text}
              </span>
            )}

            <div className="ml-4">
              {msg.sender === userId && (
                <>
                  {editingMessageId === msg._id ? (
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                      onClick={() => updateMessage(msg._id)}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                      onClick={() => {
                        setEditingMessageId(msg._id);
                        setEditedMessage(msg.text);
                      }}
                    >
                      Edit
                    </button>
                  )}
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => deleteMessage(msg._id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
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
      <button className="bg-blue-500 text-white p-2 rounded mt-2" onClick={sendMessage}>
        {sendingMessage ? "Sending..." : "Send"}
      </button>
    </div>
  );
};

export default Chat;
