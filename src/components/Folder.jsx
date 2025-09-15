// src/components/Folder.jsx
import { useState } from "react";
import { api } from "../services/api";

const Folder = ({ folder, onFolderDeleted }) => {
  const [message, setMessage] = useState("");
  const [newName, setNewName] = useState(folder.name);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${folder.name}"?`)) {
      return;
    }
    setMessage('Deleting...');
    const result = await api.deleteFolder(folder.id);
    if (result.success) {
      setMessage('Folder deleted successfully');
      if (onFolderDeleted) {
        onFolderDeleted(folder.id);
      }
    } else {
      setMessage(`Delete failed: ${result.message}`);
    }
  };


  return (
    <div>
      {
        <div>
          <span>{folder.name}</span>
          <button onClick={handleDelete}>Delete</button>
        </div>
      }
      {message && <p>{message}</p>}
    </div>
  );
};

export default Folder;
