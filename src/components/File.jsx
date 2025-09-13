// src/components/File.jsx
import { useState } from 'react';
import { api } from '../services/api';

const File = ({ file }) => {
  const [message, setMessage] = useState('');
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(file.displayName || file.originalName);

  const handleDownload = async () => {
    setMessage('Downloading...');
    const result = await api.download(file.id);
    
    if (result.success) {
      setMessage('Download started');
    } else {
      setMessage(`Download failed: ${result.message}`);
    }
  };

  const handleRename = async () => {
    if (!isRenaming) {
      setIsRenaming(true);
      return;
    }

    setMessage('Renaming...');
    const result = await api.renameFile(file.id, newName);
    
    if (result.success) {
      setMessage('File renamed successfully');
      setIsRenaming(false);
    } else {
      setMessage(`Rename failed: ${result.message}`);
    }
  };

  const cancelRename = () => {
    setIsRenaming(false);
    setNewName(file.displayName || file.originalName);
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${file.displayName || file.originalName}"?`)) {
      return;
    }

    setMessage('Deleting...');
    const result = await api.deleteFile(file.id);
    
    if (result.success) {
      setMessage('File deleted successfully');
    } else {
      setMessage(`Delete failed: ${result.message}`);
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
          <button onClick={handleRename}>Rename</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default File;