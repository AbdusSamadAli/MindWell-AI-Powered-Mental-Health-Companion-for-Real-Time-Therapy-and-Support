import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./components/signup";
import Login from "./components/login";
import Chat from "./components/chat";
import Home from "./components/Home";
import DoctorDashboard from "./components/DoctorDashboard";
import PatientDashboard from "./components/PatientDashboard";
import BookAppointment from "./components/BookAppointment";
import GeminiTherapySuggestions from "./components/GeminiTherapySuggestions";
import AppointmentList from "./components/AppointmentList";
import DashboardSummary from "./components/DashboardSummary";
import DoctorNotes from "./components/DoctorNotes";
import Layout from "./components/Layout";
import VideoCall from "./components/VideoCall";
import VideoCallLobby from "./components/VideoCallLobby";

const App = () => {
  return (
    <Router>
      <div className="p-4">
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/doctordashboard" element={<DoctorDashboard />} />
            <Route path="/patientdashboard" element={<PatientDashboard />} />
            <Route path="/bookappointment" element={<BookAppointment />} />
            <Route path="/gemini" element={<GeminiTherapySuggestions />} />
            <Route path="/list" element={<AppointmentList />} />
            <Route path="/summary" element={<DashboardSummary />} />
            <Route path="/notes" element={<DoctorNotes />} />
            <Route path="/videocall" element={<VideoCallLobby />} /> 
            <Route path="/video-call/:roomId/:userId" element={<VideoCall />} /> 
          </Routes>
        </Layout>
      </div>
    </Router>
  );
};

export default App;
