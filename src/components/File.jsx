// src/components/File.jsx
import { useState } from 'react';
import { api } from '../services/api';

const File = ({ file, onFileDeleted, onFileRenamed }) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(file.displayName || file.originalName);
  const [message, setMessage] = useState('');

  const handleRename = async () => {
    if (!isRenaming) {
      setIsRenaming(true);
      setMessage('');
      return;
    }

    setMessage('Renaming...');
    const result = await api.renameFile(file.id, newName);
    
    if (result.success) {
      setMessage('File renamed successfully');
      setIsRenaming(false);
      // Call the callback to update the parent component
      if (onFileRenamed) {
        onFileRenamed(file.id, newName);
      }
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage(`Rename failed: ${result.message}`);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const cancelRename = () => {
    setIsRenaming(false);
    setNewName(file.displayName || file.originalName);
    setMessage('');
  };

  const handlePreview = () => {
    if (file.cloudinaryUrl) {
      window.open(file.cloudinaryUrl, '_blank');
      setMessage('Opening preview...');
      setTimeout(() => setMessage(''), 2000);
    } else {
      setMessage('Preview not available');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${file.displayName || file.originalName}"?`)) {
      return;
    }

    setMessage('Deleting...');
    const result = await api.deleteFile(file.id);
    
    if (result.success) {
      setMessage('File deleted successfully');
      // Call the callback with the file ID to remove it from state
      if (onFileDeleted) {
        onFileDeleted(file.id);
      }
    } else {
      setMessage(`Delete failed: ${result.message}`);
      setTimeout(() => setMessage(''), 5000);
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
      
      {/* Message display */}
      {message && (
        <div className="mt-3 p-2 bg-blue-100 border border-blue-300 rounded text-sm text-blue-800">
          {message}
        </div>
      )}
    </div>
  );
};

export default File;