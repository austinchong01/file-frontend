// src/components/Register.jsx - Simplest Version
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage('Registering...');
    
    const result = await api.register(name, email, password, password2);
    
    if (result.success) {
      setMessage(`Registration successful! Welcome ${result.user.name}`);
    } else {
      const errorText = result.errors ? ` - ${result.errors}` : '';
      setMessage(`Registration failed: ${result.message}${errorText}`);
    }
  };

  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input 
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength="12"
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength="6"
            required
          />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input 
            type="password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            minLength="6"
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
      <button onClick={goToLogin}>Go to Login</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Register;