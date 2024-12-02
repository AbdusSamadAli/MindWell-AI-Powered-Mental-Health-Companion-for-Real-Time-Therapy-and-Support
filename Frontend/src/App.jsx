import React from "react";
import {BrowserRouter as Router,Route,Routes} from "react-router-dom";
import TextEditor from "./ws";
import Navbar from "./Navbar";
import Signup from "./signup";
import Login from "./login";
import Chat from "./chat";
import { useState } from "react";
const App = () => {
  const [documentId, setDocumentId] = React.useState(null);
  React.useEffect(() => {
    const fetchDocumentId = () => {
      setTimeout(() => {
        const fetchedDocumentId = "12345"; 
        setDocumentId(fetchedDocumentId);
      }, 1000); 
    };

    fetchDocumentId();
  }, []);

  return (
    <Router>
      <div>
        <Navbar documentId={documentId} /> 
        <div className="p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/edit/:id" element={<TextEditor />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

const Home = () => {
  console.log("Home component rendering");
  const [openIndex, setOpenIndex] = useState(null); 

  const faqs = [
    {
      question: "How does the chat room work?",
      answer:
        "Our integrated chat room uses WebSocket technology to facilitate real-time communication. This ensures that messages are delivered instantly, allowing team members to engage in seamless discussions without any delays.",
    },
    {
      question: "Can multiple users edit documents at the same time?",
      answer:
        "Yes! Our platform allows multiple users to co-edit documents simultaneously. Changes made by one user are instantly reflected for all others, ensuring everyone stays updated in real-time and avoiding version conflicts.",
    },
    {
      question: "Do only authenticated users have access to the chat room?",
      answer:
        "Yes, only authenticated users can access the chat room. To ensure a secure and collaborative environment, users must log in to participate in discussions, fostering effective communication among team members.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index); 
  };
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <div className="bg-gradient-to-r from-gray-300 via-purple-400 to-indigo-500 text-black py-10 flex flex-col justify-center items-center text-center w-full">
        <h1 className="text-5xl font-bold mb-4">
          Unlock Your Team Potential With CollabSync
        </h1>
        <p className="text-lg mb-6">
          Collaborate seamlessly and enhance productivity with our integrated
          tools.
        </p>
        <p className="text-md mb-4">
          Ever struggled to keep everyone on the same page during a project for
          Remote Collaboration?
          <br />
          With CollabSync, you can say goodbye to confusion and hello to clear
          communication and efficient workflows.
        </p>

        <p className="text-md">
          Our powerful **Document Editing** and **Real-Time Chat** features
          ensure your team stays aligned and productive.
        </p>
      </div>
      <div className="flex flex-col md:flex-row w-full mx-auto mt-10">
        <div className="bg-gradient-to-r from-yellow-300 to-orange-400 shadow-lg rounded-lg p-8 w-full md:w-1/2">
          <h2 className="text-4xl font-semibold text-gray-800 text-center mb-6">
            Features
          </h2>
          <ul className="list-disc list-inside mb-6 text-lg">
            <li className="flex items-start text-gray-600 mb-6">
              <span className="mr-6">
                ✨{" "}
                <strong className="text-xl">
                  Real-Time Document Co-Editing:
                </strong>
                <br />
                Collaborate on documents without version conflicts, seeing
                changes instantly with multiple logged in users editing the same document.
                <br />
                Utilize pre-built templates for various document types, saving
                time and ensuring consistency across your projects.
              </span>
              <img
                src="/img1.png" 
                alt="Document Editing"
                className="w-48 h-36 rounded-lg shadow-lg ml-auto"
              />
            </li>
            <li className="flex items-start text-gray-600 mb-6">
              <span className="mr-6">
                💬 <strong className="text-xl">Integrated Chat Room:</strong>
                <br />
                Engage in ~discussions with your team members in real time.
                <br />
                Use our tools seamlessly across desktop, tablet, and mobile
                devices, providing flexibility and accessibility for your team.
              </span>
            </li>
          </ul>
        </div>
        <div className="bg-gradient-to-r from-yellow-300 to-orange-400 shadow-lg rounded-lg p-6 w-full md:w-1/2 mt-6 md:mt-0 md:ml-4">
          <h2 className="text-4xl font-semibold text-gray-800 text-center mb-6">
            FAQs
          </h2>
          <ul className="list-none mb-6 text-lg">
            {" "}
            {faqs.map((faq, index) => (
              <li key={index} className="text-gray-600 mb-4">
                <button
                  onClick={() => toggleFAQ(index)} 
                  className="w-full text-left focus:outline-none flex justify-between items-center"
                >
                  <strong className="text-xl">
                    {index + 1}. {faq.question}
                  </strong>
                  <span>{openIndex === index ? "-" : "+"}</span>{" "}
                </button>
                {openIndex === index && ( 
                  <div className="mt-2">{faq.answer}</div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="bg-gradient-to-r from-gray-300 via-purple-400 to-indigo-500 rounded-lg p-8 w-full mx-auto mt-10">
        <h2 className="text-4xl font-semibold text-gray-800 text-center mb-6">
          Why Choose CollabSync?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:bg-blue-100 transition-transform duration-300 ease-in-out hover:-translate-y-2">
            <h3 className="text-2xl font-semibold mb-2 text-blue-600">
              Seamless Collaboration
            </h3>
            <p className="text-gray-600">
              Work together with your team in real-time, with zero lags or
              version conflicts.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:bg-green-100 transition-transform duration-300 ease-in-out hover:-translate-y-2">
            <h3 className="text-2xl font-semibold mb-2 text-green-600">
              Secure & Private
            </h3>
            <p className="text-gray-600">
              Your documents and communications are always protected with
              end-to-end encryption.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:bg-purple-100 transition-transform duration-300 ease-in-out hover:-translate-y-2">
            <h3 className="text-2xl font-semibold mb-2 text-purple-600">
              Integrated Tools
            </h3>
            <p className="text-gray-600">
              Built-in tools like document editing for multiple users and live
              chat to supercharge productivity.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gradient-to-r from-yellow-300 to-orange-400 shadow-lg rounded-lg p-8 w-full mx-auto mt-10">
        <h2 className="text-4xl font-semibold text-gray-800 text-center mb-6">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md hover:bg-blue-50 transition duration-300 ease-in-out hover:shadow-lg">
            <h3 className="text-2xl font-semibold text-blue-600 mb-2">
              1. Sign Up
            </h3>
            <p className="text-gray-600">
              Create an account by signing up with your email to start
              collaborating.
            </p>
            <button className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition duration-300 ease-in-out">
              Sign Up
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:bg-green-50 transition duration-300 ease-in-out hover:shadow-lg">
            <h3 className="text-2xl font-semibold text-green-600 mb-2">
              2. Log In
            </h3>
            <p className="text-gray-600">
              Access your account and your shared workspace with the team after
              logging in.
            </p>
            <button className="bg-green-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-600 transition duration-300 ease-in-out">
              Log In
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:bg-purple-50 transition duration-300 ease-in-out hover:shadow-lg">
            <h3 className="text-2xl font-semibold text-purple-600 mb-2">
              3. Edit Documents
            </h3>
            <p className="text-gray-600">
              Edit documents with your team in real time. Changes are synced
              instantly.
            </p>
            <button className="bg-purple-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-purple-600 transition duration-300 ease-in-out">
              Edit a Document
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:bg-yellow-50 transition duration-300 ease-in-out hover:shadow-lg">
            <h3 className="text-2xl font-semibold text-yellow-600 mb-2">
              4. Chat in Real-Time
            </h3>
            <p className="text-gray-600">
              Use the integrated chat feature to communicate with your team
              while editing.
            </p>
            <button className="bg-yellow-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-yellow-600 transition duration-300 ease-in-out">
              Chat with Team
            </button>
          </div>
        </div>
      </div>
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-6 mt-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="mb-2">
            &copy; {new Date().getFullYear()} CollabSync. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
