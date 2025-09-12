import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'
import './Login.css' // Reuse the same styles

function Register({ onLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState([])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([])
    }
  }

  const validateForm = () => {
    const newErrors = []

    // Name validation
    if (!formData.name.trim()) {
      newErrors.push({ msg: 'Name is required' })
    } else if (formData.name.trim().length > 10) {
      newErrors.push({ msg: 'Name must be 10 characters or less' })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.push({ msg: 'Email is required' })
    } else if (!emailRegex.test(formData.email)) {
      newErrors.push({ msg: 'Valid email required' })
    }

    // Password validation
    if (!formData.password) {
      newErrors.push({ msg: 'Password is required' })
    } else if (formData.password.length < 6) {
      newErrors.push({ msg: 'Password must be 6+ characters' })
    }

    // Password confirmation validation
    if (formData.password !== formData.password2) {
      newErrors.push({ msg: 'Passwords must match' })
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors([])

    // Client-side validation
    const validationErrors = validateForm()
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      setLoading(false)
      return
    }

    try {
      const response = await api.post('/auth/register', {
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        password2: formData.password2
      })
      
      if (response.success) {
        // After successful registration, automatically log the user in
        const loginResponse = await api.post('/auth/login', {
          email: formData.email.toLowerCase().trim(),
          password: formData.password
        })
        
        if (loginResponse.success) {
          onLogin(loginResponse.user)
        } else {
          // Registration succeeded but login failed, redirect to login page
          setErrors([{ msg: 'Registration successful! Please log in.' }])
        }
      } else {
        if (response.errors) {
          setErrors(response.errors)
        } else {
          setErrors([{ msg: response.message || 'Registration failed' }])
        }
      }
    } catch (error) {
      console.error('Registration error:', error)
      setErrors([{ msg: error.message || 'Registration failed' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>📁 File Uploader</h1>
          <p>Create your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          {errors.length > 0 && (
            <div className="error-message">
              {errors.map((error, index) => (
                <div key={index}>{error.msg}</div>
              ))}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
              className="form-input"
              maxLength="10"
            />
            <small style={{ color: '#666', fontSize: '0.875rem' }}>
              Maximum 10 characters
            </small>
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className="form-input"
            />
            <small style={{ color: '#666', fontSize: '0.875rem' }}>
              Password must be at least 6 characters long
            </small>
          </div>
          
          <div className="form-group">
            <label htmlFor="password2">Confirm Password</label>
            <input
              type="password"
              id="password2"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
              className="form-input"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="login-button"
            style={{ backgroundColor: '#28a745' }}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        
        <div className="login-footer">
          <p>
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register