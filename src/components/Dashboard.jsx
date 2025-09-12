import { useState, useEffect } from 'react'
import { api } from '../services/api'
import FilePreviewModal from './FilePreviewModal'
import CreateFolderModal from './CreateFolderModal'
import RenameModal from './RenameModal'
import UploadModal from './UploadModal'
import './Dashboard.css'

function Dashboard({ user, onLogout }) {
  const [folders, setFolders] = useState([])
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Modal states
  const [showFilePreview, setShowFilePreview] = useState(false)
  const [showCreateFolder, setShowCreateFolder] = useState(false)
  const [showRename, setShowRename] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  
  // Selected items for modals
  const [selectedFile, setSelectedFile] = useState(null)
  const [selectedFolder, setSelectedFolder] = useState(null)
  const [renameItem, setRenameItem] = useState(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const response = await api.get('/api/dashboard')
      if (response.success) {
        setFolders(response.folders)
        setFiles(response.files)
      } else {
        setError('Failed to load dashboard data')
      }
    } catch (error) {
      console.error('Dashboard error:', error)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleFilePreview = (file) => {
    setSelectedFile(file)
    setShowFilePreview(true)
  }

  const handleFileDownload = (fileId) => {
    window.open(`http://localhost:3000/files/${fileId}/download`, '_blank')
  }

  const handleFileRename = (file) => {
    setRenameItem({ type: 'file', item: file })
    setShowRename(true)
  }

  const handleFolderRename = (folder) => {
    setRenameItem({ type: 'folder', item: folder })
    setShowRename(true)
  }

  const handleFileDelete = async (file) => {
    if (!confirm(`Are you sure you want to delete "${file.displayName || file.originalName}"?`)) {
      return
    }

    try {
      const response = await api.delete(`/files/${file.id}`)
      if (response.success) {
        loadDashboardData() // Refresh the data
      } else {
        alert('Error deleting file')
      }
    } catch (error) {
      console.error('Delete file error:', error)
      alert('Error deleting file')
    }
  }

  const handleFolderDelete = async (folder) => {
    if (!confirm(`Are you sure you want to delete the folder "${folder.name}"?`)) {
      return
    }

    try {
      const response = await api.delete(`/folders/${folder.id}`)
      if (response.success) {
        loadDashboardData() // Refresh the data
      } else {
        alert(response.message || 'Error deleting folder')
      }
    } catch (error) {
      console.error('Delete folder error:', error)
      alert('Error deleting folder')
    }
  }

  const getFileIcon = (mimetype) => {
    if (mimetype.startsWith('image/')) return '🖼️'
    if (mimetype.startsWith('video/')) return '🎥'
    if (mimetype === 'application/pdf') return '📄'
    return '📄'
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const calculateTotalSize = () => {
    const totalBytes = files.reduce((sum, file) => sum + file.size, 0)
    return formatFileSize(totalBytes)
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div>Loading dashboard...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <div>{error}</div>
        <button onClick={loadDashboardData}>Try Again</button>
      </div>
    )
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <h1>📁 File Uploader</h1>
          <div className="dashboard-user-info">
            <span>Hello, {user.name}!</span>
            <button onClick={onLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Action Bar */}
        <div className="dashboard-actions">
          <h2>📊 Dashboard</h2>
          <div className="action-buttons">
            <button 
              onClick={() => setShowCreateFolder(true)}
              className="action-button primary"
            >
              📁 New Folder
            </button>
            <button 
              onClick={() => setShowUpload(true)}
              className="action-button success"
            >
              📤 Upload
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="dashboard-grid">
          {/* Folders */}
          {folders.map(folder => (
            <div key={folder.id} className="dashboard-item folder-item">
              <div className="item-icon">📁</div>
              <div className="item-info">
                <h3 className="item-name">{folder.name}</h3>
                <p className="item-details">Folder</p>
              </div>
              <div className="item-actions">
                <button 
                  onClick={() => handleFolderRename(folder)}
                  className="action-btn rename"
                  title="Rename Folder"
                >
                  ✏️
                </button>
                <button 
                  onClick={() => handleFolderDelete(folder)}
                  className="action-btn delete"
                  title="Delete Folder"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}

          {/* Files */}
          {files.map(file => {
            const displayName = file.displayName || file.originalName
            return (
              <div key={file.id} className="dashboard-item file-item">
                <div className="item-icon">{getFileIcon(file.mimetype)}</div>
                <div className="item-info">
                  <h3 className="item-name" title={displayName}>
                    {displayName.length > 20 ? displayName.substring(0, 20) + '...' : displayName}
                  </h3>
                  <p className="item-details">
                    {formatFileSize(file.size)} • {new Date(file.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="item-actions">
                  <button 
                    onClick={() => handleFilePreview(file)}
                    className="action-btn preview"
                    title="Preview"
                  >
                    👁️
                  </button>
                  <button 
                    onClick={() => handleFileDownload(file.id)}
                    className="action-btn download"
                    title="Download"
                  >
                    📥
                  </button>
                  <button 
                    onClick={() => handleFileRename(file)}
                    className="action-btn rename"
                    title="Rename"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => handleFileDelete(file)}
                    className="action-btn delete"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            )
          })}

          {/* Empty State */}
          {folders.length === 0 && files.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📂</div>
              <h3>No files or folders yet</h3>
              <p>Upload files or create folders to get started</p>
            </div>
          )}
        </div>

        {/* Storage Summary */}
        <div className="storage-summary">
          <h3>📈 Storage Summary</h3>
          <div className="storage-info">
            <span className="storage-size">{calculateTotalSize()}</span>
            <span className="storage-label">Total Size</span>
          </div>
        </div>
      </main>

      {/* Modals */}
      {showFilePreview && selectedFile && (
        <FilePreviewModal
          file={selectedFile}
          onClose={() => {
            setShowFilePreview(false)
            setSelectedFile(null)
          }}
        />
      )}

      {showCreateFolder && (
        <CreateFolderModal
          onClose={() => setShowCreateFolder(false)}
          onSuccess={() => {
            setShowCreateFolder(false)
            loadDashboardData()
          }}
        />
      )}

      {showRename && renameItem && (
        <RenameModal
          item={renameItem}
          onClose={() => {
            setShowRename(false)
            setRenameItem(null)
          }}
          onSuccess={() => {
            setShowRename(false)
            setRenameItem(null)
            loadDashboardData()
          }}
        />
      )}

      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onSuccess={() => {
            setShowUpload(false)
            loadDashboardData()
          }}
          folders={folders}
        />
      )}
    </div>
  )
}

export default Dashboard