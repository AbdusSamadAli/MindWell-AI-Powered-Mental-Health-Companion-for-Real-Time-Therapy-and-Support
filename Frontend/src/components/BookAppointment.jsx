import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BookAppointment = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [formData, setFormData] = useState({
    patientName: "",
    contact: "",
    date: "",
    time: "",
  });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/auth/role/doctor", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setDoctors(res.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAppointment = async (e) => {
    e.preventDefault();

    if (
      !selectedDoctorId ||
      !formData.patientName ||
      !formData.contact ||
      !formData.date ||
      !formData.time
    ) {
      alert("Please fill out all fields.");
      return;
    }

    const appointmentDetails = {
      doctorId: selectedDoctorId,
      ...formData,
    };

    try {
      const res = await axios.post("http://localhost:8080/api/appointments", appointmentDetails, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.status === 201) {
        alert("✅ Appointment booked! Confirmation email sent to the doctor.");
        navigate("/"); 
      }
    } catch (err) {
      console.error("❌ Booking failed:", err);
      alert("Something went wrong while booking the appointment.");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md mt-6 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-green-700">Book an Appointment</h2>

      <select
        value={selectedDoctorId}
        onChange={(e) => setSelectedDoctorId(e.target.value)}
        className="border p-2 rounded mb-4 w-full"
      >
        <option value="">-- Select a Doctor --</option>
        {doctors.map((doc) => (
          <option key={doc._id} value={doc._id}>
            {doc.username} ({doc.specialization})
          </option>
        ))}
      </select>

      <form onSubmit={handleAppointment} className="space-y-4">
        <input
          type="text"
          name="patientName"
          placeholder="Your Name"
          value={formData.patientName}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="contact"
          placeholder="Contact Number"
          value={formData.contact}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Book Appointment
        </button>
      </form>
    </div>
  );
};

export default BookAppointment;
