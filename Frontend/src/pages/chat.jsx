import useChatSocket from "../hooks/useChatSocket";
import { useState } from "react";

const Chat = () => {
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  const {
    users,selectedUser,setSelectedUser,messages,sendMessage, updateMessage, deleteMessage
  } = useChatSocket(userId);

  const [text, setText] = useState("");
  const [editMessageId, setEditMessageId] = useState(null);
  const [editedText, setEditedText] = useState("");

  const handleSend = () => {
    if (!selectedUser || text.trim() === "") return;
    sendMessage(text, () => setText(""));
  };

  const handleUpdate = (id) => {
    updateMessage(id, editedText);
    setEditMessageId(null);
    setEditedText("");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold text-blue-600 mb-4">
        {role === "doctor" ? "Chat with a Patient" : "Chat with a Doctor"}
      </h1>

      <select
        value={selectedUser || ""}
        onChange={(e) => setSelectedUser(e.target.value)}
        className="border p-2 rounded mb-4 w-full"
      >
        <option value="">
          {role === "doctor"
            ? "-- Select a Patient --"
            : "-- Select a Doctor --"}
        </option>
        {users.map((user) => (
          <option key={user._id} value={user._id}>
            {user.username}{" "}
            {user.specialization ? `(${user.specialization})` : ""}
          </option>
        ))}
      </select>

      <div className="border p-4 h-64 overflow-y-auto bg-gray-50 rounded mb-4">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`mb-2 ${
              msg.sender === userId ? "text-right" : "text-left"
            }`}
          >
            {editMessageId === msg._id ? (
              <div>
                <input
                  type="text"
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="border px-2 py-1 rounded mr-2 w-2/3"
                />
                <button
                  onClick={() => handleUpdate(msg._id)}
                  className="bg-green-500 text-white px-2 py-1 rounded mr-1"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditMessageId(null);
                    setEditedText("");
                  }}
                  className="bg-gray-400 text-white px-2 py-1 rounded"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="inline-block px-3 py-2 rounded bg-blue-100 relative">
                <span>{msg.text}</span>
                {msg.sender === userId && (
                  <span className="text-xs text-gray-600 ml-2">
                    <button
                      onClick={() => {
                        setEditMessageId(msg._id);
                        setEditedText(msg.text);
                      }}
                      className="text-blue-600 hover:underline mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteMessage(msg._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <input
        type="text"
        placeholder="Type your message..."
        className="border p-2 rounded w-full mb-2"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={handleSend}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Send
      </button>
    </div>
  );
};

export default Chat;
