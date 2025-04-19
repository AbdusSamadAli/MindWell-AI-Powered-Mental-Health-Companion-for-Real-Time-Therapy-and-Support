import React from "react";

const AppointmentList = ({
  appointments,
  search,
  loading,
  updateStatus,
}) => {
  const filteredAppointments = appointments.filter((appt) =>
    appt.patientName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold mb-4">📅 Upcoming Appointments</h2>
      {loading ? (
        <p>Loading appointments...</p>
      ) : filteredAppointments.length === 0 ? (
        <p>No matching appointments found.</p>
      ) : (
        <ul className="space-y-4">
          {filteredAppointments
            .filter((appt) => appt.status !== "Cancelled")
            .map((appt) => (
              <li
                key={appt._id}
                className="border border-gray-300 rounded p-4 shadow-sm bg-white hover:bg-gray-50 transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">{appt.patientName}</h3>
                  <span
                    className={`px-2 py-1 text-sm rounded-full ${
                      appt.status === "Confirmed"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {appt.status === "Confirmed" ? "Confirmed" : "Upcoming"}
                  </span>
                </div>

                {appt.status !== "Confirmed" && (
                  <div className="mb-2">
                    <button
                      onClick={() => updateStatus(appt._id, "Confirmed")}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 mr-2"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => updateStatus(appt._id, "Cancelled")}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Decline
                    </button>
                  </div>
                )}
                <p>
                  <span className="font-semibold">📞 Contact:</span> {appt.contact}
                </p>
                <p>
                  <span className="font-semibold">🗓️ Date:</span> {appt.date}
                </p>
                <p>
                  <span className="font-semibold">⏰ Time:</span> {appt.time}
                </p>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default AppointmentList;
