// src/components/Dashboard.jsx
import { useState, useEffect } from "react";
import { api } from "../services/api";
import File from "./File";

const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("Loading dashboard...");
  const [uploadMessage, setUploadMessage] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      const result = await api.dashboard();

      if (result.success) {
        setMessage(`Dashboard - Welcome ${result.user.name}`);
        setFiles(result.files);
      } else {
        setMessage(`Dashboard failed to load: ${result.message}`);
      }
    };

    loadDashboard();
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadMessage("Uploading...");
    
    const result = await api.upload(file);
    
    if (result.success) {
      setUploadMessage("File uploaded successfully!");
      // Refresh the dashboard to show the new file
      const dashboardResult = await api.dashboard();
      if (dashboardResult.success) {
        setFiles(dashboardResult.files);
      }
      // Clear the file input
      event.target.value = '';
    } else {
      setUploadMessage(`Upload failed: ${result.message}`);
    }
  };

  return (
    <div>
      {message}
      
      <div>
        <input 
          type="file" 
          onChange={handleFileUpload}
          accept="image/*,video/*,application/pdf"
        />
        {uploadMessage && <p>{uploadMessage}</p>}
      </div>

      {files.length > 0 && (
        <div>
          <h2>Your Files:</h2>
          {files.map((file) => (
            <File key={file.id} file={file} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;