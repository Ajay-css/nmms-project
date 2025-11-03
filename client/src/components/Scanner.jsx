import React, { useRef, useState } from "react";
import axios from "axios";
import "./Scanner.css";

function Scanner() {
  const videoRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);

  const startScan = async () => {
    setScanning(true);
    setResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      const video = videoRef.current;
      video.srcObject = stream;
      await video.play();

      // Capture one frame after 3 seconds
      setTimeout(async () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const blob = await new Promise((res) => canvas.toBlob(res, "image/jpeg"));
        stream.getTracks().forEach((track) => track.stop()); // close camera

        const formData = new FormData();
        formData.append("file", blob, "scan.jpg");
        formData.append("studentName", "Test Student");
        formData.append("subject", "MAT");
        formData.append("answer_key", "ABCDABCDABCDABCD");

        // ✅ Call your Node.js backend (not Flask directly)
        const res = await axios.post(
          "https://your-node-backend-url.onrender.com/api/scan",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        setResult(res.data.data);
        setScanning(false);
      }, 3000);
    } catch (err) {
      console.error(err);
      alert("Camera not accessible or error capturing image.");
      setScanning(false);
    }
  };

  return (
    <div className="scan-container">
      {!scanning && !result && (
        <button className="scan-btn" onClick={startScan}>
          📷 Scan OMR Sheet
        </button>
      )}
      {scanning && (
        <div className="video-wrapper">
          <video ref={videoRef} autoPlay playsInline muted className="video-feed"></video>
          <p className="scanning-text">Scanning … hold your OMR sheet steady</p>
        </div>
      )}
      {result && (
        <div className="result-popup">
          <h3>Scan Result</h3>
          <p>Student: {result.studentName}</p>
          <p>Subject: {result.subject}</p>
          <p>Score: {result.score}</p>
          <button onClick={() => setResult(null)}>Scan Again</button>
        </div>
      )}
    </div>
  );
}

export default Scanner;