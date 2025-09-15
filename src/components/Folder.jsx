// src/components/Folder.jsx
import { useState } from "react";
import { api } from "../services/api";
import File from "./File";

const Folder = ({ folder, onFolderDeleted }) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(folder.name);
  const [currentName, setCurrentName] = useState(folder.name);
  const [isViewingContents, setIsViewingContents] = useState(false);
  const [folderFiles, setFolderFiles] = useState([]);

  const handleRename = async () => {
    if (!isRenaming) {
      setIsRenaming(true);
      return;
    }

    console.log("Renaming...");
    const result = await api.renameFolder(folder.id, newName);

    if (result.success) {
      console.log("Folder renamed successfully");
      setCurrentName(newName);
      setIsRenaming(false);
    } else {
      console.log(`Rename failed: ${result.message}`);
    }
  };

  const cancelRename = () => {
    setIsRenaming(false);
    setNewName(currentName);
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${currentName}"?`)) {
      return;
    }
    console.log("Deleting...");
    const result = await api.deleteFolder(folder.id);
    if (result.success) {
      console.log("Folder deleted successfully");
      if (onFolderDeleted) {
        onFolderDeleted(folder.id);
      }
    } else {
      console.log(`Delete failed: ${result.message}`);
    }
  };

  const handleViewFolder = async () => {
    const result = await api.getFolder(folder.id);

    if (result.success) {
      setFolderFiles(result.files);
      setIsViewingContents(true);
    } else {
      console.log(`Failed to Retrieve Folder: ${result.message}`);
    }
  };

  const handleBackToFolder = () => {
    setIsViewingContents(false);
    setFolderFiles([]);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const result = await api.uploadFileInFolder(file, folder.id);
    
    if (result.success) {
      const refreshResult = await api.getFolder(folder.id);
      if (refreshResult.success) {
        setFolderFiles(refreshResult.files);
      }
    } else {
      console.log(`Upload failed: ${result.message}`);
    }
  };

  const triggerFileUpload = () => {
    document.getElementById(`file-input-${folder.id}`).click();
  };

  const handleFileDeleted = (deletedFileId) => {
    setFolderFiles(prevFiles => prevFiles.filter(file => file.id !== deletedFileId));
  };

  const handleFileRenamed = (renamedFileId, newName) => {
    setFolderFiles(prevFiles => 
      prevFiles.map(file => 
        file.id === renamedFileId 
          ? { ...file, displayName: newName }
          : file
      )
    );
  };

  return (
    <div>
      {isViewingContents ? (
        <div className="min-h-screen bg-gray-100">
          {/* Header */}
          <div className="bg-blue-500 text-white px-8 py-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={handleBackToFolder}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                ← Back
              </button>
              <h1 className="text-2xl font-bold">Contents of {currentName}</h1>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-4xl mx-auto p-6">
            {/* Upload Section */}
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Upload File to Folder</h2>
              <div className="flex items-center gap-4">
                <button 
                  onClick={triggerFileUpload}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Upload File
                </button>
                <input 
                  id={`file-input-${folder.id}`}
                  type="file" 
                  onChange={handleFileUpload}
                  accept="image/*,video/*,application/pdf"
                  className="hidden"
                />
              </div>
            </div>

            {/* Files Section */}
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Files in Folder</h2>
              {folderFiles.length > 0 ? (
                <div className="space-y-3">
                  {folderFiles.map((file) => (
                    <File
                      key={file.id}
                      file={file}
                      onFileDeleted={handleFileDeleted}
                      onFileRenamed={handleFileRenamed}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-8">No files in this folder</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="border border-gray-200 rounded-lg p-4 bg-blue-50">
          {isRenaming ? (
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="flex-1 px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
              />
              <div className="flex gap-2">
                <button 
                  onClick={handleRename}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
                >
                  Save
                </button>
                <button 
                  onClick={cancelRename}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-blue-600 text-lg">📁</span>
                <span className="text-gray-800 font-medium">{currentName}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={handleViewFolder}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
                >
                  View Folder
                </button>
                <button 
                  onClick={handleRename}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded text-sm"
                >
                  Rename
                </button>
                <button 
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Folder;