// src/components/Dashboard.jsx
import { useState, useEffect } from "react";
import { api } from "../services/api";
import File from "./File";
import Folder from "./Folder"

const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [message, setMessage] = useState("Loading dashboard...");
  const [uploadMessage, setUploadMessage] = useState("");
  const [folderMessage, setFolderMessage] = useState("");

  const loadDashboard = async () => {
    const result = await api.dashboard();

    if (result.success) {
      setMessage(`Dashboard - Welcome ${result.user.name}`);
      setFiles(result.files);
      setFolders(result.folders);
    } else {
      setMessage(`Dashboard failed to load: ${result.message}`);
    }
  };

  useEffect(() => {
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
      await loadDashboard();
      // Clear the file input
      event.target.value = '';
    } else {
      setUploadMessage(`Upload failed: ${result.message}`);
    }
  };

  const handleCreateFolder = async () => {
    const folderName = prompt("Enter folder name:");
    
    if (!folderName || !folderName.trim()) {
      setFolderMessage("Folder name is required");
      return;
    }

    setFolderMessage("Creating folder...");

    const result = await api.newFolder(folderName);
    
    if (result.success) {
      setFolderMessage("Folder uploaded successfully!");
      await loadDashboard();
    } else {
      setFolderMessage(`Folder creation failed: ${result.message}`);
    }
  };

  const handleFileDeleted = (deletedFileId) => {
    setFiles(prevFiles => prevFiles.filter(file => file.id !== deletedFileId));
  };

  const handleFileRenamed = (renamedFileId, newName) => {
    setFiles(prevFiles => 
      prevFiles.map(file => 
        file.id === renamedFileId 
          ? { ...file, displayName: newName }
          : file
      )
    );
  };

  const handleFolderDeleted = (deletedFolderId) => {
    setFolders(prevFolders => prevFolders.filter(folder => folder.id !== deletedFolderId));
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
        <button onClick={handleCreateFolder}>Add Folder</button>
        {uploadMessage && <p>{uploadMessage}</p>}
        {folderMessage && <p>{folderMessage}</p>}
      </div>

      {folders.length > 0 && (
        <div>
          <h2>Your Folders:</h2>
          {folders.map((folder) => (
            <div key={folder.id}>
              <Folder key={folder.id} folder={folder} onFolderDeleted={handleFolderDeleted}/>
            </div>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <div>
          <h2>Your Files:</h2>
          {files.map((file) => (
            <File 
              key={file.id} 
              file={file} 
              onFileDeleted={handleFileDeleted}
              onFileRenamed={handleFileRenamed}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;