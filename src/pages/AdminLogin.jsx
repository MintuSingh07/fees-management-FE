import React, { useState } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom'

function AdminLogin() {
  const [adminName, setAdminName] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8000/admin-login', { adminName, adminCode });
      if (response.status === 200) {
        localStorage.setItem('admToken', response.data.token);
        setMessage('Login as admin is successful');
        navigate('/std-list')
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h2>Admin Login</h2>
      <div>{message}</div>
      <div>
        <label htmlFor="adminName">Admin Name:</label>
        <input type="text" id="adminName" value={adminName} onChange={e => setAdminName(e.target.value)} />
      </div>
      <div>
        <label htmlFor="adminCode">Admin Code:</label>
        <input type="password" id="adminCode" value={adminCode} onChange={e => setAdminCode(e.target.value)} />
      </div>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default AdminLogin;
