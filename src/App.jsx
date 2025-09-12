import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [backendStatus, setBackendStatus] = useState('Testing connection...')
  const [connectionSuccess, setConnectionSuccess] = useState(false)

  // Test backend connection
  useEffect(() => {
    const testBackendConnection = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/test', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        if (response.ok) {
          const data = await response.json()
          setBackendStatus(`✅ ${data.message} (${data.timestamp})`)
          setConnectionSuccess(true)
        } else {
          setBackendStatus(`❌ Backend responded with status: ${response.status}`)
          setConnectionSuccess(false)
        }
      } catch (error) {
        setBackendStatus(`❌ Connection failed: ${error.message}`)
        setConnectionSuccess(false)
      }
    }

    testBackendConnection()
  }, [])

  return (
    <>
      
      {/* Backend Connection Status */}
      <div className="card" style={{ 
        backgroundColor: connectionSuccess ? '#d4edda' : '#f8d7da',
        border: `1px solid ${connectionSuccess ? '#c3e6cb' : '#f5c6cb'}`,
        borderRadius: '8px',
        padding: '1rem',
        margin: '1rem 0'
      }}>
        <h3>Backend Connection Status</h3>
        <p style={{ 
          color: connectionSuccess ? '#155724' : '#721c24',
          fontWeight: 'bold'
        }}>
          {backendStatus}
        </p>
      </div>
    </>
  )
}

export default App