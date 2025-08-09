import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VideoCallLobby = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [role, setRole] = useState("");
  const token = localStorage.getItem("token");
  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);

    const fetchUsers = async () => {
      if (!storedRole) return;
      const targetRole = storedRole === "patient" ? "doctor" : "patient";
      try {
        const res = await axios.get(
          `http://localhost:8080/api/auth/role/${targetRole}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUsers(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch users:", err);
      }
    };

    fetchUsers();
  }, []);
  const handleStartCall = () => {
    if (!selectedUserId || !currentUserId) {
      alert("Please select a user to start the video call.");
      return;
    }

    const roomId = `${currentUserId}`;
    const targetUserId = `${selectedUserId}`;
    navigate(`/video-call/${roomId}/${targetUserId}`);
  };

  return (
    <div className="bg-white p-6 rounded shadow mt-6 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-indigo-700">
        {role === "doctor" ? "Select a Patient" : "Select a Doctor"}
      </h2>

      <select
        value={selectedUserId}
        onChange={(e) => setSelectedUserId(e.target.value)}
        className="border p-2 rounded mb-4 w-full"
      >
        <option value="">
          -- Select {role === "doctor" ? "Patient" : "Doctor"} --
        </option>
        {users.map((user) => (
          <option key={user._id} value={user._id}>
            {user.username} ({user.email})
          </option>
        ))}
      </select>

      <button
        onClick={handleStartCall}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Start Video Call
      </button>
    </div>
  );
};

export default VideoCallLobby;
