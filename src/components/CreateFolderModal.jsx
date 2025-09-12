import { useState } from 'react'
import { api } from '../services/api'

function CreateFolderModal({ onClose, onSuccess }) {
  const [folderName, setFolderName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!folderName.trim()) {
      setError('Folder name is required')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await api.post('/folders/create', {
        name: folderName.trim(),
        parentId: null // Dashboard only creates root-level folders
      })

      if (response.success) {
        onSuccess()
      } else {
        setError(response.message || 'Error creating folder')
      }
    } catch (error) {
      console.error('Create folder error:', error)
      setError(error.message || 'Error creating folder')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>📁 Create Folder</h3>
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
                htmlFor="folderName" 
                style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#333'
                }}
              >
                Folder Name
              </label>
              <input
                type="text"
                id="folderName"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="Enter folder name"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              />
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
              {loading ? 'Creating...' : '📁 Create Folder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateFolderModal