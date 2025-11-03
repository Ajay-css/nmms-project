import React, { useState } from "react";
import axios from "axios";
import "./AdminPanel.css";

function AdminPanel() {
  const [file, setFile] = useState(null);

  const uploadKey = async () => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      await axios.post("https://nmms-project-server.onrender.com/api/admin/upload-key", formData, {
        headers: { Authorization: localStorage.getItem("token") }
      });
      alert("Answer key uploaded successfully!");
    } catch {
      alert("Upload failed!");
    }
  };

  const clearResults = async () => {
    try {
      await axios.delete("https://nmms-project-server.onrender.com/api/admin/clear-results", {
        headers: { Authorization: localStorage.getItem("token") }
      });
      alert("All results cleared!");
    } catch {
      alert("Error clearing results!");
    }
  };

  return (
    <div className="admin-panel">
      <h2>Admin Dashboard</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={uploadKey}>Upload Answer Key</button>
      <button className="clear-btn" onClick={clearResults}>Clear All Results</button>
    </div>
  );
}

export default AdminPanel;