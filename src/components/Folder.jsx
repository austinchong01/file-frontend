// src/components/Folder.jsx
import { useState } from "react";
import { api } from "../services/api";
import File from "./File";

const Folder = ({ folder, onFolderDeleted }) => {
  const [message, setMessage] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
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

    setMessage("Renaming...");
    const result = await api.renameFolder(folder.id, newName);

    if (result.success) {
      setMessage("Folder renamed successfully");
      setCurrentName(newName);
      setIsRenaming(false);
    } else {
      setMessage(`Rename failed: ${result.message}`);
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
    setMessage("Deleting...");
    const result = await api.deleteFolder(folder.id);
    if (result.success) {
      setMessage("Folder deleted successfully");
      if (onFolderDeleted) {
        onFolderDeleted(folder.id);
      }
    } else {
      setMessage(`Delete failed: ${result.message}`);
    }
  };

  const handleViewFolder = async () => {
    const result = await api.getFolder(folder.id);

    if (result.success) {
      setFolderFiles(result.files);
      setIsViewingContents(true);
    } else {
      setMessage(`Failed to Retrieve Folder: ${result.message}`);
    }
  };

  const handleBackToFolder = () => {
    setIsViewingContents(false);
    setFolderFiles([]);
    setUploadMessage(""); // Clear upload message when going back
  };

  // Updated function to handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadMessage("Uploading...");
    
    const result = await api.uploadFileInFolder(file, folder.id);
    
    if (result.success) {
      setUploadMessage("File uploaded successfully!");
      const refreshResult = await api.getFolder(folder.id);
      if (refreshResult.success) {
        setFolderFiles(refreshResult.files);
      }
    } else {
      setUploadMessage(`Upload failed: ${result.message}`);
    }
  };

  // Function to trigger the hidden file input
  const triggerFileUpload = () => {
    document.getElementById(`file-input-${folder.id}`).click();
  };

  const handleFileDeleted = (deletedFileId) => {
    setFolderFiles(prevFiles => prevFiles.filter(file => file.id !== deletedFileId));
  };

  return (
    <div>
      {isViewingContents ? (
        <div>
          <button onClick={handleBackToFolder}>← Back</button>
          <button onClick={triggerFileUpload}>Upload File</button>
          <input 
            id={`file-input-${folder.id}`}
            type="file" 
            onChange={handleFileUpload}
            accept="image/*,video/*,application/pdf"
          />
          <h3>Contents of {currentName}</h3>
          {uploadMessage && <p>{uploadMessage}</p>}
          {folderFiles.length > 0 ? (
            folderFiles.map((file) => (
              <File
                key={file.id}
                file={file}
                onFileDeleted={handleFileDeleted}
              />
            ))
          ) : (
            <p>No files in this folder</p>
          )}
        </div>
      ) : (
        <>
          {isRenaming ? (
            <div>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <button onClick={handleRename}>Save</button>
              <button onClick={cancelRename}>Cancel</button>
            </div>
          ) : (
            <div>
              <span>{currentName}</span>
              <button onClick={handleViewFolder}>View Folder</button>
              <button onClick={handleRename}>Rename</button>
              <button onClick={handleDelete}>Delete</button>
            </div>
          )}
          {message && <p>{message}</p>}
        </>
      )}
    </div>
  );
};

export default Folder;