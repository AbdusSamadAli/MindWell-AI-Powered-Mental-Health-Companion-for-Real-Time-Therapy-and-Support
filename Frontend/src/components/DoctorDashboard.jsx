import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import DashboardSummary from "./DashboardSummary";
import AppointmentList from "./AppointmentList";

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedApptId, setSelectedApptId] = useState(null);
  const doctorId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/appointments/doctor/${doctorId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setAppointments(res.data);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [doctorId]);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:8080/api/appointments/status/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setAppointments((prev) =>
        prev.map((appt) => (appt._id === id ? { ...appt, status } : appt))
      );
      setMessage(`Appointment ${status === "Confirmed" ? "accepted" : "declined"} successfully!`);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error updating status:", err);
      setMessage("Failed to update appointment status.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-green-800">👨‍⚕️ Doctor Dashboard</h1>
      <p className="mt-2 text-gray-600">Manage appointments & consult with patients.</p>

      <DashboardSummary appointments={appointments} />

      <div className="flex flex-wrap gap-4 mt-8">
        <Link to="/chat">
          <button className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
            Start Chat
          </button>
        </Link>
      </div>

      <div className="mt-8">
        <input
          type="text"
          placeholder="Search by patient name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded shadow-sm"
        />
      </div>

      {message && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {message}
        </div>
      )}

      <AppointmentList
        appointments={appointments}
        loading={loading}
        search={search}
        updateStatus={updateStatus}
        selectedApptId={selectedApptId}
        setSelectedApptId={setSelectedApptId}
      />
    </div>
  );
};

export default DoctorDashboard;
