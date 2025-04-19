import React from "react";

const DashboardSummary = ({ appointments }) => {
  const today = new Date().toDateString();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      <div className="bg-white shadow rounded p-4 border-l-4 border-green-500">
        <h2 className="text-sm text-gray-500">Total Appointments</h2>
        <p className="text-xl font-semibold text-green-700">{appointments.length}</p>
      </div>
      <div className="bg-white shadow rounded p-4 border-l-4 border-blue-500">
        <h2 className="text-sm text-gray-500">Today's Appointments</h2>
        <p className="text-xl font-semibold text-blue-700">
          {appointments.filter((appt) => new Date(appt.date).toDateString() === today).length}
        </p>
      </div>
      <div className="bg-white shadow rounded p-4 border-l-4 border-yellow-500">
        <h2 className="text-sm text-gray-500">Patients</h2>
        <p className="text-xl font-semibold text-yellow-700">
          {[...new Set(appointments.map((appt) => appt.patientName))].length}
        </p>
      </div>
      <div className="bg-white shadow rounded p-4 border-l-4 border-purple-500">
        <h2 className="text-sm text-gray-500">New Messages</h2>
        <p className="text-xl font-semibold text-purple-700">🔒 Coming Soon</p>
      </div>
    </div>
  );
};

export default DashboardSummary;
