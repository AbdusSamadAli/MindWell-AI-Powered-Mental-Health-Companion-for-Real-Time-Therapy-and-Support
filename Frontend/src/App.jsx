import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./pages/signup";
import Login from "./pages/login";
import Chat from "./pages/chat";
import Home from "./pages/Home";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import BookAppointment from "./components/BookAppointment";
import GeminiTherapySuggestions from "./pages/GeminiTherapySuggestions";
import Layout from "./components/Layout";
import VideoCall from "./components/VideoCall";
import VideoCallLobby from "./pages/VideoCallLobby";

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
            <Route path="/videocall" element={<VideoCallLobby />} />
            <Route path="/video-call/:roomId/:userId" element={<VideoCall />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
};

export default App;
