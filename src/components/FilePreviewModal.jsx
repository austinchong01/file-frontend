function FilePreviewModal({ file, onClose }) {
  const displayName = file.displayName || file.originalName

  const renderPreview = () => {
    if (file.mimetype.startsWith('image/')) {
      return (
        <img 
          src={file.cloudinaryUrl} 
          alt={displayName}
          style={{ 
            maxWidth: '100%', 
            maxHeight: '400px', 
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }} 
        />
      )
    } else if (file.mimetype.startsWith('video/')) {
      return (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎥</div>
          <h4>{displayName}</h4>
          <p style={{ color: '#666' }}>Video File</p>
          <a 
            href={file.cloudinaryUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '0.5rem 1rem',
              background: '#007bff',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px'
            }}
          >
            🔗 Open in New Tab
          </a>
        </div>
      )
    } else if (file.mimetype === 'application/pdf') {
      return (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📄</div>
          <h4>{displayName}</h4>
          <p style={{ color: '#666' }}>PDF Document</p>
          <a 
            href={file.cloudinaryUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '0.5rem 1rem',
              background: '#007bff',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px'
            }}
          >
            🔗 Open in New Tab
          </a>
        </div>
      )
    } else {
      return (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📄</div>
          <h4>{displayName}</h4>
          <p style={{ color: '#666' }}>Preview not available for this file type</p>
          <a 
            href={file.cloudinaryUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '0.5rem 1rem',
              background: '#007bff',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px'
            }}
          >
            🔗 Open in New Tab
          </a>
        </div>
      )
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h3>📁 {displayName}</h3>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body" style={{ textAlign: 'center' }}>
          {renderPreview()}
        </div>
        <div className="modal-footer">
          <button className="modal-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default FilePreviewModal