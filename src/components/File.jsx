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
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
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
          <span className="text-gray-800 font-medium break-all">
            {file.displayName || file.originalName}
          </span>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={handleDownload}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded text-sm"
            >
              Download
            </button>
            <button 
              onClick={handlePreview}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
            >
              Preview
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
  );
};

export default File;