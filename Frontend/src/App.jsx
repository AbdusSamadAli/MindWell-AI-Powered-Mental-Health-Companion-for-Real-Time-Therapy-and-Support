import React from "react";
import {BrowserRouter as Router,Route,Routes} from "react-router-dom";
import TextEditor from "./components/ws";
import Navbar from "./components/Navbar";
import Signup from "./components/signup";
import Login from "./components/login";
import Chat from "./components/chat";
import Home from "./components/Home";
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
export default App;