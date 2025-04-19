import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const useChatSocket = (userId) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:8080", {
      transports: ["websocket"],
      withCredentials: true,
    });

    if (userId) {
      socketRef.current.emit("registerUser", userId);
    }

    const handleReceive = (msg) => {
      if (
        (msg.sender === selectedUser && msg.recipients.includes(userId)) ||
        (msg.sender === userId && msg.recipients.includes(selectedUser))
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socketRef.current.on("messageReceived", handleReceive);

    return () => {
      socketRef.current.off("messageReceived", handleReceive);
      socketRef.current.disconnect();
    };
  }, [selectedUser, userId]);

  useEffect(() => {
    if (!selectedUser || !userId) return;
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/messages/${userId}/${selectedUser}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setMessages(res.data);
      } catch (err) {
        console.error("Error fetching messages:", err.message);
      }
    };
    fetchMessages();
  }, [selectedUser, userId]);

  useEffect(() => {
    const fetchUsers = async () => {
      const role = localStorage.getItem("role");
      if (!role) return;
      const targetRole = role === "patient" ? "doctor" : "patient";
      try {
        const res = await axios.get(
          `http://localhost:8080/api/auth/role/${targetRole}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err.message);
      }
    };
    fetchUsers();
  }, []);

  const sendMessage = async (text, clearInput = null) => {
    const messageText = (text || "").toString().trim(); 
  
    if ((!messageText) || !selectedUser) {
      return alert("Select a user & type message.");
    }

    const messageData = {text: messageText,sender: userId,
      senderUsername: localStorage.getItem("username"),
      recipients: [selectedUser],
      timestamp: new Date(),
    };

    socketRef.current.emit("sendMessage", messageData, (response) => {
      if (response.status === "ok") {
        if (clearInput) clearInput();
      } else {
        console.error("Send error:", response.message || response.error);
      }
    });
  };

  const updateMessage = async (id, newText) => {
    try {
      await axios.put(
        `http://localhost:8080/api/messages/${id}`,
        { text: newText },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setMessages((prev) =>
        prev.map((msg) => (msg._id === id ? { ...msg, text: newText } : msg))
      );
    } catch (err) {
      console.error("Update failed:", err.message);
    }
  };

  const deleteMessage = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/messages/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setMessages((prev) => prev.filter((msg) => msg._id !== id));
    } catch (err) {
      console.error("Delete failed:", err.message);
    }
  };
  const joinVideoCall = (roomId) => {
    socketRef.current.emit("join-room", roomId, userId);
  };

  return {
    users, selectedUser,setSelectedUser,messages,setMessages,sendMessage,updateMessage, deleteMessage, joinVideoCall
  };
};

export default useChatSocket;
