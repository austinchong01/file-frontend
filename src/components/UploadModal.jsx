import { useState } from 'react'
import { api } from '../services/api'

function UploadModal({ onClose, onSuccess, folders }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [displayName, setDisplayName] = useState('')
  const [selectedFolder, setSelectedFolder] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setSelectedFile(file)
    
    // Auto-suggest display name
    if (file && !displayName.trim()) {
      setDisplayName(file.name)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedFile) {
      setError('Please select a file')
      return
    }

    if (!displayName.trim()) {
      setError('Display name is required')
      return
    }

    console.log('Starting upload...', {
      file: selectedFile.name,
      size: selectedFile.size,
      type: selectedFile.type,
      displayName: displayName.trim(),
      selectedFolder
    })

    setLoading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('displayName', displayName.trim())
      if (selectedFolder) {
        formData.append('folderId', selectedFolder)
      }

      console.log('FormData prepared, making request...')

      const response = await api.post('/files/upload', formData)

      console.log('Upload response:', response)

      if (response.success) {
        console.log('Upload successful!')
        onSuccess()
      } else {
        console.error('Upload failed:', response.message)
        setError(response.message || 'Error uploading file')
      }
    } catch (error) {
      console.error('Upload error:', error)
      setError(error.message || 'Error uploading file')
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>📤 Upload File</h3>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Supported Formats Info */}
            <div style={{
              background: '#d1ecf1',
              color: '#0c5460',
              padding: '0.75rem',
              borderRadius: '4px',
              border: '1px solid #bee5eb',
              marginBottom: '1rem'
            }}>
              <strong>ℹ️ Supported file formats:</strong>
              <div style={{ marginTop: '0.5rem' }}>
                <span style={{ 
                  background: '#007bff', 
                  color: 'white', 
                  padding: '0.2rem 0.4rem', 
                  borderRadius: '3px', 
                  fontSize: '0.75rem',
                  marginRight: '0.25rem'
                }}>JPG</span>
                <span style={{ 
                  background: '#007bff', 
                  color: 'white', 
                  padding: '0.2rem 0.4rem', 
                  borderRadius: '3px', 
                  fontSize: '0.75rem',
                  marginRight: '0.25rem'
                }}>PNG</span>
                <span style={{ 
                  background: '#007bff', 
                  color: 'white', 
                  padding: '0.2rem 0.4rem', 
                  borderRadius: '3px', 
                  fontSize: '0.75rem',
                  marginRight: '0.25rem'
                }}>GIF</span>
                <span style={{ 
                  background: '#dc3545', 
                  color: 'white', 
                  padding: '0.2rem 0.4rem', 
                  borderRadius: '3px', 
                  fontSize: '0.75rem',
                  marginRight: '0.25rem'
                }}>PDF</span>
                <span style={{ 
                  background: '#28a745', 
                  color: 'white', 
                  padding: '0.2rem 0.4rem', 
                  borderRadius: '3px', 
                  fontSize: '0.75rem',
                  marginRight: '0.25rem'
                }}>MP4</span>
                <span style={{ 
                  background: '#28a745', 
                  color: 'white', 
                  padding: '0.2rem 0.4rem', 
                  borderRadius: '3px', 
                  fontSize: '0.75rem'
                }}>MOV</span>
              </div>
              <small style={{ display: 'block', marginTop: '0.5rem' }}>
                Maximum file size: 10MB
              </small>
            </div>

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
                htmlFor="file" 
                style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#333'
                }}
              >
                Select File
              </label>
              <input
                type="file"
                id="file"
                onChange={handleFileChange}
                required
                accept="image/*,application/pdf,video/mp4,video/quicktime"
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              />
              {selectedFile && (
                <small style={{ color: '#666', fontSize: '0.875rem', display: 'block', marginTop: '0.25rem' }}>
                  Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                </small>
              )}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label 
                htmlFor="displayName" 
                style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#333'
                }}
              >
                Display Name
              </label>
              <input
                type="text"
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter display name"
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

            <div style={{ marginBottom: '1rem' }}>
              <label 
                htmlFor="folder" 
                style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#333'
                }}
              >
                Destination Folder
              </label>
              <select
                id="folder"
                value={selectedFolder}
                onChange={(e) => setSelectedFolder(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              >
                <option value="">Root Directory</option>
                {folders.map(folder => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>
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
              className="modal-button success"
              disabled={loading}
            >
              {loading ? 'Uploading...' : '📤 Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UploadModal