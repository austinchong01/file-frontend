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
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-blue-700 text-white px-8 py-4">
        <h1 className="text-2xl font-bold">{message}</h1>
      </div>
      
      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        {/* Upload Section */}
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Add Files & Folders</h2>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Upload File:
              </label>
              <input 
                type="file" 
                onChange={handleFileUpload}
                accept="image/*,video/*,application/pdf"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
              />
            </div>
            
            <div className="flex items-end">
              <button 
                onClick={handleCreateFolder}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Add Folder
              </button>
            </div>
          </div>
          
          {/* Messages */}
          {uploadMessage && (
            <p className="text-sm text-gray-600 mb-2">{uploadMessage}</p>
          )}
          {folderMessage && (
            <p className="text-sm text-gray-600">{folderMessage}</p>
          )}
        </div>

        {/* Folders Section */}
        {folders.length > 0 && (
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Your Folders:</h2>
            <div className="space-y-2">
              {folders.map((folder) => (
                <div key={folder.id}>
                  <Folder key={folder.id} folder={folder} onFolderDeleted={handleFolderDeleted}/>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Files Section */}
        {files.length > 0 && (
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Your Files:</h2>
            <div className="space-y-2">
              {files.map((file) => (
                <File 
                  key={file.id} 
                  file={file} 
                  onFileDeleted={handleFileDeleted}
                  onFileRenamed={handleFileRenamed}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;