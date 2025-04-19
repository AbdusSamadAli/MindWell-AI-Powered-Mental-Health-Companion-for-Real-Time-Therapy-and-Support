import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom"; 

const socket = io("http://localhost:8080");

const VideoCall = () => {
  const { roomId, userId } = useParams();
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerConnection = useRef(null);
  const [joined, setJoined] = useState(false);
  const [callStarted, setCallStarted] = useState(false); 

  const config = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }], 
  };

  useEffect(() => {
    if (!roomId || !userId) return;

    const init = async () => {
      await initCamera();

      socket.emit("join-room", { roomId, userId });

      socket.on("user-connected", async ({ userId: remoteUserId }) => {
        console.log("User connected:", remoteUserId);
        if (callStarted) await createOffer(remoteUserId); 
      });

      socket.on("offer", async ({ offer, from }) => {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);
        socket.emit("answer", { answer, to: from });
      });

      socket.on("answer", async ({ answer }) => {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
      });

      socket.on("ice-candidate", async ({ candidate }) => {
        if (peerConnection.current) {
          await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
        }
      });

      socket.on("user-disconnected", () => {
        remoteVideoRef.current.srcObject = null;
      });

      setJoined(true);
    };

    init();

    return () => {
      socket.disconnect();
    };
  }, [roomId, userId, callStarted]); 

  const initCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localVideoRef.current.srcObject = stream;

      peerConnection.current = new RTCPeerConnection(config);

      stream.getTracks().forEach((track) => {
        peerConnection.current.addTrack(track, stream);
      });

      peerConnection.current.ontrack = (event) => {
        remoteVideoRef.current.srcObject = event.streams[0];
      };

      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", { candidate: event.candidate, roomId });
        }
      };
    } catch (error) {
      console.error("Camera access denied or unavailable:", error);
      alert("Could not access camera. Please allow permission or close other tabs using the webcam.");
    }
  };

  const createOffer = async (toUserId) => {
    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);
    socket.emit("offer", { offer, to: toUserId });
  };

  const startCall = () => {
    setCallStarted(true);
    socket.emit("start-call", { roomId, userId });
  };

  const endCall = () => {
    socket.emit("end-call", { roomId, userId });
    setCallStarted(false);
    peerConnection.current.close(); 
    localVideoRef.current.srcObject.getTracks().forEach(track => track.stop()); 
    remoteVideoRef.current.srcObject = null; 
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-gray-100 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800">Video Call Room: {roomId}</h2>

      <div className="flex gap-6 mt-6">
        <div>
          <p className="text-center text-lg font-medium">You</p>
          <video ref={localVideoRef} autoPlay muted playsInline className="rounded-lg w-80 h-60 bg-black" />
        </div>
        <div>
          <p className="text-center text-lg font-medium">Remote User</p>
          <video ref={remoteVideoRef} autoPlay playsInline className="rounded-lg w-80 h-60 bg-black" />
        </div>
      </div>

      {!joined && <p className="text-sm text-gray-500">Joining room...</p>}

      <div className="flex gap-4 mt-6">
        {!callStarted ? (
          <button
            onClick={startCall}
            className="bg-blue-500 text-white px-6 py-3 rounded-full text-lg hover:bg-blue-600 transition duration-300"
          >
            Start Call
          </button>
        ) : (
          <button
            onClick={endCall}
            className="bg-red-500 text-white px-6 py-3 rounded-full text-lg hover:bg-red-600 transition duration-300"
          >
            End Call
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoCall;
