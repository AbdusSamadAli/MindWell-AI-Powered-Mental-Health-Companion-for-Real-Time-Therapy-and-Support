import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return (
    <nav className="bg-gray-900 py-4 shadow-lg w-full m-0 p-0 fixed top-0 left-0 right-0 z-50">
      <div className="w-full flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold ml-4">
          MindWell
        </Link>
        <ul className="flex space-x-6">
          <li>
            <Link
              to="/chat"
              className="text-gray-300 hover:text-white hover:underline transition duration-300 ease-in-out"
            >
              Chat
            </Link>
          </li>
          <li>
            <Link
              to="/videocall"
              className="text-gray-300 hover:text-white hover:underline transition duration-300 ease-in-out"
            >
              Video Call
            </Link>
          </li>
          {!token ? (
            <>
              <li>
                <Link
                  to="/signup"
                  className="text-gray-300 hover:text-white hover:underline transition duration-300 ease-in-out"
                >
                  Signup
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white hover:underline transition duration-300 ease-in-out mr-4"
                >
                  Login
                </Link>
              </li>
            </>
          ) : (
            <>
              {role === "patient" && (
                <>
                  <li>
                    <Link
                      to="/patientdashboard"
                      className="text-gray-300 hover:text-white hover:underline transition duration-300 ease-in-out"
                    >
                      Patient Dashboard
                    </Link>
                  </li>
                </>
              )}
              {role === "patient" && (
                <>
                  <li>
                    <Link
                      to="/bookappointment"
                      className="text-gray-300 hover:text-white hover:underline transition duration-300 ease-in-out"
                    >
                      Book Appointment
                    </Link>
                  </li>
                </>
              )}
              {role === "doctor" && (
                <>
                  <li>
                    <Link
                      to="/doctordashboard"
                      className="text-gray-300 hover:text-white hover:underline transition duration-300 ease-in-out"
                    >
                      Doctor Dashboard
                    </Link>
                  </li>
                </>
              )}
              {role === "doctor" && (
                <>
                  <li>
                    <Link
                      to="/notes"
                      className="text-gray-300 hover:text-white hover:underline transition duration-300 ease-in-out"
                    >
                      Notes
                    </Link>
                  </li>
                </>
              )}
              <li>
                <button
                  onClick={handleLogout}
                  className="text-white bg-red-600 hover:bg-red-700 transition duration-300 ease-in-out py-2 px-4 rounded-md shadow-lg"
                >
                  Logout
                </button>
              </li>
              {role === "patient" && (
                <li>
                  <Link
                    to="/gemini"
                    className="text-gray-300 hover:text-white hover:underline transition duration-300 ease-in-out"
                  >
                    Gemini Suggestions
                  </Link>
                </li>
              )}
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
