import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ documentId }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">
        <h1 className="text-white text-2xl font-bold">CollabSync</h1>
        </Link>
        <ul className="flex space-x-6">
          {documentId && (
            <li>
              <Link
                to={`/edit/${documentId}`}
                className="text-gray-300 hover:text-white hover:underline transition duration-300 ease-in-out"
              >
                Edit Document
              </Link>
            </li>
          )}
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
              to="/signup"
              className="text-gray-300 hover:text-white hover:underline transition duration-300 ease-in-out"
            >
              Signup
            </Link>
          </li>
          <li>
            <Link
              to="/login"
              className="text-gray-300 hover:text-white hover:underline transition duration-300 ease-in-out"
            >
              Login
            </Link>
          </li>
          {localStorage.getItem("token") && (
            <li>
              <button
                onClick={handleLogout}
                className="text-white bg-red-600 hover:bg-red-700 transition duration-300 ease-in-out py-2 px-4 rounded-md shadow-lg"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
