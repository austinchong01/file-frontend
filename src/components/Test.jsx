// src/components/Test.jsx
import { useState, useEffect } from 'react';
import { api } from '../services/api';

const Test = () => {
  const [message, setMessage] = useState('Testing connection...');

  useEffect(() => {
    const testConnection = async () => {
      const result = await api.testConnection();
      
      if (result.success) {
        setMessage(result.data.message);
      } else {
        setMessage(`Connection failed: ${result.error}`);
      }
    };
    testConnection();
  }, []);

  return <div>{message}</div>;
};

export default Test;