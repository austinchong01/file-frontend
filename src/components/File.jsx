// src/components/File.jsx
import { useState } from 'react';
import { api } from '../services/api';

const File = ({ file, onFileDeleted, onFileRenamed }) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(file.displayName || file.originalName);

  const handleDownload = async () => {
    console.log('Downloading...');
    const result = await api.download(file.id);
    
    if (result.success) {
      console.log('Download started');
    } else {
      console.log(`Download failed: ${result.message}`);
    }
  };

  const handleRename = async () => {
    if (!isRenaming) {
      setIsRenaming(true);
      return;
    }

    console.log('Renaming...');
    const result = await api.renameFile(file.id, newName);
    
    if (result.success) {
      console.log('File renamed successfully');
      setIsRenaming(false);
      // Call the callback to update the parent component
      if (onFileRenamed) {
        onFileRenamed(file.id, newName);
      }
    } else {
      console.log(`Rename failed: ${result.message}`);
    }
  };

  const cancelRename = () => {
    setIsRenaming(false);
    setNewName(file.displayName || file.originalName);
  };

  const handlePreview = () => {
    if (file.cloudinaryUrl) {
      window.open(file.cloudinaryUrl, '_blank');
    } else {
      console.log('Preview not available');
  }
};

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${file.displayName || file.originalName}"?`)) {
      return;
    }

    console.log('Deleting...');
    const result = await api.deleteFile(file.id);
    
    if (result.success) {
      console.log('File deleted successfully');
      // Call the callback with the file ID to remove it from state
      if (onFileDeleted) {
        onFileDeleted(file.id);
      }
    } else {
      console.log(`Delete failed: ${result.message}`);
    }
  };

  return (
    <div>
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
          <span>{file.displayName || file.originalName}</span>
          <button onClick={handleDownload}>Download</button>
          <button onClick={handlePreview}>Preview</button>
          <button onClick={handleRename}>Rename</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default File;