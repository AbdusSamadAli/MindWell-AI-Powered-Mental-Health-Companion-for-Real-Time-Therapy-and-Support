import { useState, useEffect } from "react";
import axios from "axios";

const DoctorNotes = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [note, setNote] = useState("");
  const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/auth/role/patient", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPatients(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch patients:", err);
      }
    };

    fetchPatients();
  }, [token]);
  useEffect(() => {
    if (selectedPatientId) {
      const savedNote = localStorage.getItem(`note-${selectedPatientId}`);
      setNote(savedNote || "");
    }
  }, [selectedPatientId]);

  const handleNoteChange = (e) => {
    const newNote = e.target.value;
    setNote(newNote);
    localStorage.setItem(`note-${selectedPatientId}`, newNote);
  };

  const clearNote = () => {
    localStorage.removeItem(`note-${selectedPatientId}`);
    setNote("");
  };

  return (
    <div className="bg-white p-6 rounded shadow mt-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📝 Patient Appointment Notes</h2>

      <select
        value={selectedPatientId}
        onChange={(e) => setSelectedPatientId(e.target.value)}
        className="border rounded px-3 py-2 mb-4 w-full"
      >
        <option value="">-- Select a Patient --</option>
        {patients.map((p) => (
          <option key={p._id} value={p._id}>
            {p.username} ({p.email})
          </option>
        ))}
      </select>

      {selectedPatientId && (
        <div>
          <textarea
            placeholder="Write notes here..."
            value={note}
            onChange={handleNoteChange}
            className="w-full h-40 p-3 border rounded resize-none"
          />
          <div className="flex justify-between mt-2">
            <p className="text-sm text-gray-500">Auto-saved in browser</p>
            <button
              onClick={clearNote}
              className="px-4 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
            >
              Save Notes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorNotes;
