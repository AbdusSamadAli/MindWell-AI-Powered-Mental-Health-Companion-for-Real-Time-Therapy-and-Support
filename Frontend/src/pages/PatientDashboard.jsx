import React, { useEffect, useState } from "react";
import axios from "axios";

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const fetchConfirmedDoctors = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:8080/api/appointments/confirmed-doctors/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAppointments(data); 
    } catch (error) {
      console.error("Error fetching confirmed doctors:", error);
    }
  };

  useEffect(() => {
    fetchConfirmedDoctors();
  }, [userId]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-green-700">
        Welcome to the Patient Dashboard
      </h1>
      <p className="mt-4 text-gray-600">
        Here you can talk to doctors and book appointments.
      </p>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">
          Your Confirmed Appointments
        </h2>
        {appointments.length === 0 ? (
          <p className="text-gray-500">No confirmed appointments yet.</p>
        ) : (
          <ul className="space-y-4">
            {appointments.map((appointment, index) => (
              <li key={index} className="p-4 border rounded-lg bg-white shadow">
                <p>
                  <span className="font-medium text-green-600">Doctor:</span>{" "}
                  {appointment.doctor.username}
                </p>
                <p>
                  <span className="font-medium text-green-600">Date:</span>{" "}
                  {appointment.date}
                </p>
                <p>
                  <span className="font-medium text-green-600">Time:</span>{" "}
                  {appointment.time}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
