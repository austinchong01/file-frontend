import { useState, useEffect } from 'react'
import { api } from '../services/api'

function RenameModal({ item, onClose, onSuccess }) {
  const [newName, setNewName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (item) {
      if (item.type === 'file') {
        setNewName(item.item.displayName || item.item.originalName)
      } else {
        setNewName(item.item.name)
      }
    }
  }, [item])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!newName.trim()) {
      setError('Name is required')
      return
    }

    setLoading(true)
    setError('')

    try {
      let response
      
      if (item.type === 'file') {
        response = await api.post('/files/rename', {
          fileId: item.item.id,
          displayName: newName.trim()
        })
      } else {
        response = await api.post('/folders/rename', {
          folderId: item.item.id,
          name: newName.trim()
        })
      }

      if (response.success) {
        onSuccess()
      } else {
        setError(response.message || 'Error renaming item')
      }
    } catch (error) {
      console.error('Rename error:', error)
      setError(error.message || 'Error renaming item')
    } finally {
      setLoading(false)
    }
  }

  if (!item) return null

  const isFile = item.type === 'file'
  const currentName = isFile ? (item.item.displayName || item.item.originalName) : item.item.name

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>✏️ Rename {isFile ? 'File' : 'Folder'}</h3>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div style={{
                background: '#f8d7da',
                color: '#721c24',
                padding: '0.75rem',
                borderRadius: '4px',
                border: '1px solid #f5c6cb',
                marginBottom: '1rem'
              }}>
                {error}
              </div>
            )}
            
            <div style={{ marginBottom: '1rem' }}>
              <label 
                htmlFor="newName" 
                style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#333'
                }}
              >
                New {isFile ? 'File' : 'Folder'} Name
              </label>
              <input
                type="text"
                id="newName"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder={`Enter new ${isFile ? 'file' : 'folder'} name`}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              />
              <small style={{ color: '#666', fontSize: '0.875rem' }}>
                Current name: {currentName}
              </small>
            </div>
          </div>
          
          <div className="modal-footer">
            <button 
              type="button" 
              className="modal-button" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="modal-button primary"
              disabled={loading}
            >
              {loading ? 'Renaming...' : '✏️ Rename'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RenameModal