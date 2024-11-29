import React, { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

const SAVE_INTERVAL_MS = 2000;
const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
];

export default function TextEditor() {
  const { id: documentId } = useParams();
  const [socket, setSocket] = useState(null);
  const [quill, setQuill] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const s = io("https://collabsync-real-time-collaboration-and-ahxb.onrender.com", {
      query: { documentId }, 
    });
    setSocket(s);
  
    s.on("connect_error", (err) => {
      setError("Connection error: " + err.message);
    });
  
    return () => {
      s.disconnect();
    };
  }, [documentId]);

  useEffect(() => {
    if (!socket || !quill) return;

    socket.emit("get-document", documentId);

    socket.once("load-document", (documentData) => {
      quill.setContents(documentData);
      quill.enable();
    });

    socket.on("error", (err) => {
      setError(err.message);
    });
  }, [socket, quill, documentId]);
  useEffect(() => {
    if (!socket || !quill) return;

    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents());
    }, SAVE_INTERVAL_MS);

    return () => {
      clearInterval(interval);
    };
  }, [socket, quill]);
  useEffect(() => {
    if (!socket || !quill) return;

    const handler = (delta) => {
      quill.updateContents(delta);
    };
    socket.on("receive-changes", handler);

    return () => {
      socket.off("receive-changes", handler);
    };
  }, [socket, quill]);
  useEffect(() => {
    if (!socket || !quill) return;

    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return;
      socket.emit("send-changes", delta);
    };
    quill.on("text-change", handler);

    return () => {
      quill.off("text-change", handler);
    };
  }, [socket, quill]);
  const wrapperRef = useCallback((wrapper) => {
    if (!wrapper) return;

    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    const q = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: TOOLBAR_OPTIONS },
      placeholder: "Start typing your document here...",
    });
    q.disable(); 
    q.setText("Loading...");
    setQuill(q);
  }, []);
  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div
      className="container"
      style={{ height: "90vh", padding: "20px", overflowY: "auto" }}
      ref={wrapperRef}
    ></div>
  );
}
