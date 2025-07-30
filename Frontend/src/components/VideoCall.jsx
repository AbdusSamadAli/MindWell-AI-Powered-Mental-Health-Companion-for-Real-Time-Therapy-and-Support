import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";

const socket = io("http://localhost:8080");

const VideoCall = () => {
  const { roomId, userId } = useParams();
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerConnection = useRef(null);
  const [remoteUserId, setRemoteUserId] = useState(null);
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

      socket.on("user-connected", async ({ userId: remoteId }) => {
        console.log("User connected:", remoteId);
        setRemoteUserId(remoteId);

        // Only call if call already started
        if (callStarted && remoteId) {
          await createOffer(remoteId);
        }
      });

      socket.on("offer", async ({ offer, from }) => {
        console.log("Received offer from", from);
        setRemoteUserId(from);
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);
        socket.emit("answer", { answer, to: from, from: userId });
      });

      socket.on("answer", async ({ answer, from }) => {
        console.log("Received answer from", from);
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
      });

      socket.on("ice-candidate", async ({ candidate }) => {
        try {
          await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.error("Error adding received ice candidate", err);
        }
      });

      socket.on("user-disconnected", ({ userId: disconnectedId }) => {
        console.log("User disconnected:", disconnectedId);
        remoteVideoRef.current.srcObject = null;
      });

      setJoined(true);
    };

    init();

    return () => {
      socket.disconnect();
      if (peerConnection.current) {
        peerConnection.current.close();
        peerConnection.current = null;
      }
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
          socket.emit("ice-candidate", {
            candidate: event.candidate,
            to: remoteUserId,
            from: userId,
          });
        }
      };
    } catch (err) {
      alert("Could not access your camera or microphone.");
      console.error(err);
    }
  };

  const createOffer = async (toUserId) => {
    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);
    socket.emit("offer", { offer, to: toUserId, from: userId });
  };

  const startCall = async () => {
    setCallStarted(true);
    if (remoteUserId) {
      await createOffer(remoteUserId);
    }
  };

  const endCall = () => {
    setCallStarted(false);
    socket.emit("end-call", { roomId, userId });

    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    const tracks = localVideoRef.current?.srcObject?.getTracks();
    tracks?.forEach(track => track.stop());

    localVideoRef.current.srcObject = null;
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
