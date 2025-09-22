// src/components/Dashboard.jsx - Updated with logout functionality
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { api } from "../services/api";
import File from "./File";
import Folder from "./Folder";

const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [message, setMessage] = useState("Loading dashboard...");
  const [uploadMessage, setUploadMessage] = useState("");
  const [folderMessage, setFolderMessage] = useState("");
  const navigate = useNavigate();

  const loadDashboard = async () => {
    const result = await api.dashboard();

    if (result.success) {
      setMessage(`${result.user.name}'s Dashboard`);
      setFiles(result.files);
      setFolders(result.folders);
    } else {
      if (result.message === 'Authentication required' || result.redirect === '/login') {
        navigate('/login');
      } else {
        setMessage(`Dashboard failed to load: ${result.message}`);
      }
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleLogout = async () => {
    const result = await api.logout();
    if (result.success) {
      navigate('/login');
    } else {
      console.error('Logout failed:', result.message);
    }
  };

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
      setTimeout(() => setUploadMessage(''), 3000);
    } else {
      setUploadMessage(`Upload failed: ${result.message}`);
      setTimeout(() => setUploadMessage(''), 5000);
    }
  };

  const handleCreateFolder = async () => {
    const folderName = prompt("Enter folder name:");
    
    if (!folderName || !folderName.trim()) {
      setFolderMessage("Folder name is required");
      setTimeout(() => setFolderMessage(''), 3000);
      return;
    }

    setFolderMessage("Creating folder...");

    const result = await api.newFolder(folderName);
    
    if (result.success) {
      setFolderMessage("Folder created successfully!");
      await loadDashboard();
      setTimeout(() => setFolderMessage(''), 3000);
    } else {
      setFolderMessage(`Folder creation failed: ${result.message}`);
      setTimeout(() => setFolderMessage(''), 5000);
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
    <div className="min-h-screen bg-gray-700">
      {/* Header */}
      <div className="bg-blue-700 text-white px-8 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{message}</h1>
          <button 
            onClick={handleLogout}
            className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6 ">
        {/* Upload Section */}
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6">
          
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Upload File:
              </label>
              <input 
                type="file" 
                onChange={handleFileUpload}
                accept="image/*,video/*,application/pdf"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500 border-black"
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
          <div className="bg-gray-200 shadow-md rounded px-8 pt-6 pb-8 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Folders</h2>
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
          <div className="bg-gray-200 shadow-md rounded px-8 pt-6 pb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Files</h2>
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