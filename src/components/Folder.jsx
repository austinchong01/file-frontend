// src/components/Folder.jsx
import { useState } from 'react';
import { api } from '../services/api';

const Folder = ({ folder }) => {
  const [message, setMessage] = useState('');
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(folder.displayName || folder.originalName);

  const handleRename = async () => {
    if (!isRenaming) {
      setIsRenaming(true);
      return;
    }

    setMessage('Renaming...');
    const result = await api.renameFile(folder.id, newName);
    
    if (result.success) {
      setMessage('Folder renamed successfully');
      setIsRenaming(false);
    } else {
      setMessage(`Rename failed: ${result.message}`);
    }
  };

  const cancelRename = () => {
    setIsRenaming(false);
    setNewName(folder.displayName || folder.originalName);
  };


  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${folder.displayName || folder.originalName}"?`)) {
      return;
    }

    setMessage('Deleting...');
    const result = await api.deleteFolder(folder.id);
    
    if (result.success) {
      setMessage('Folder deleted successfully');
      // Call the callback with the file ID to remove it from state
      if (onFileDeleted) {
        onFileDeleted(file.id);
      }
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
          <span>{folder.displayName || folder.originalName}</span>
          <button onClick={handleRename}>Rename</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default Folder;