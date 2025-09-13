// src/components/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Logging in...');
    
    const result = await api.login(email, password);
    
    if (result.success) {
      setMessage(`Login successful! Welcome ${result.user.name}`);
      navigate('/dashboard');
    } else {
      setMessage(`Login failed: ${result.message}`);
    }
  };

  const goToRegister = () => {
    navigate('/register');
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
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
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <button onClick={goToRegister}>Go to Register</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;