import { useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";  // To access URL parameters
import Quill from "quill";
import "quill/dist/quill.snow.css";

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, false] }],
  ["bold", "italic", "underline"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["link", "image"],
  ["clean"],
];

const WS_URL = "http://localhost:8080";

export default function TextEditor({ token }) {
  const { documentId } = useParams();  // Get documentId from the URL
  const [socket, setSocket] = useState(null);
  const [quill, setQuill] = useState(null);
  const [isEditorInitialized, setIsEditorInitialized] = useState(false);

  useEffect(() => {
    const s = io(WS_URL);
    setSocket(s);

    if (documentId) {
      s.emit("get-document", documentId, token);  // Use documentId from the URL
    }

    return () => {
      s.disconnect();
    };
  }, [documentId, token]);

  useEffect(() => {
    if (!socket || !documentId || !quill) return;

    socket.on("load-document", (documentData) => {
      console.log("Document loaded:", documentData);
      const storedDocument = localStorage.getItem(documentId);
      if (storedDocument) {
        quill.setContents(JSON.parse(storedDocument));
      } else {
        quill.setContents(documentData || []);
      }
      quill.enable();
    });

    socket.on("receive-changes", (delta) => {
      console.log("Received change delta:", delta);
      if (quill) {
        quill.updateContents(delta);
      }
    });

    return () => {
      socket.off("load-document");
      socket.off("receive-changes");
    };
  }, [socket, documentId, quill]);

  const wrapperRef = useCallback(
    (wrapper) => {
      if (wrapper == null || isEditorInitialized) return;

      wrapper.innerHTML = "";
      const editor = document.createElement("div");
      wrapper.append(editor);

      const q = new Quill(editor, {
        theme: "snow",
        modules: { toolbar: TOOLBAR_OPTIONS },
      });
      setQuill(q);
      setIsEditorInitialized(true);
    },
    [isEditorInitialized]
  );

  useEffect(() => {
    if (!quill || !socket) return;

    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return;
      console.log("Sending change delta:", delta);
      socket.emit("send-changes", delta);
    };

    quill.on("text-change", handler);

    return () => {
      quill.off("text-change", handler);
    };
  }, [quill, socket]);

  const saveDocument = () => {
    if (!quill) return;
    const content = quill.getContents();
    socket.emit("save-document", content);

    // Save the document to localStorage
    localStorage.setItem(documentId, JSON.stringify(content));
    console.log(`Document ${documentId} saved to localStorage.`);
  };

  return (
    <div className="container">
      <div ref={wrapperRef}></div>
      {isEditorInitialized && (
        <button
          onClick={saveDocument}
          className="bg-blue-500 mt-5 rounded text-white py-2 px-4 hover:bg-blue-600"
        >
          Save Document
        </button>
      )}
    </div>
  );
}
