// src/components/Dashboard.jsx
import { useState, useEffect } from "react";
import { api } from "../services/api";
import File from "./File";

const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("Loading dashboard...");

  useEffect(() => {
    const loadDashboard = async () => {
      const result = await api.dashboard();

      if (result.success) {
        setMessage(`Dashboard - Welcome ${result.user.name}`);
        setFiles(result.files); // Store the files array
      } else {
        setMessage(`Dashboard failed to load: ${result.message}`);
      }
    };

    loadDashboard();
  }, []);

  return (
    <div>
      {message}
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
