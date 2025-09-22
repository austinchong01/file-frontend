// src/components/Register.jsx
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
    <div className="min-h-screen bg-gray-700 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-gray-200 shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Register
          </h1>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Name:
              </label>
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength="12"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email:
              </label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Password:
              </label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength="6"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Confirm Password:
              </label>
              <input 
                type="password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                minLength="6"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            
            <button 
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Register
            </button>
          </form>
          
          <div className="text-center mt-4">
            <button 
              onClick={goToLogin}
              className="text-blue-500 hover:text-blue-800 text-sm"
            >
              Already have an account? Login here
            </button>
          </div>
          
          {message && (
            <p className="text-center text-sm mt-4 text-gray-600">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;