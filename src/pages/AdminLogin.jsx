import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import "../styles/admintLogin.css"

function AdminLogin() {
  const [adminName, setAdminName] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://fees-management-be.onrender.com/admin-login', { adminName, adminCode });
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

  const handelMove = () => {
    const pElement = document.querySelector('.inputField>p');
    pElement.style.transform = 'translate(-15px, -28px)';
    pElement.style.scale = .8;
    pElement.style.color = '#000'

    document.body.addEventListener('click', handleOutsideClick);
  };

  const handleOutsideClick = (event) => {
    const pElement = document.querySelector('.inputField>p');
    const inputElement = document.querySelector('.inputField>input');

    if (!inputElement.contains(event.target)) {
      pElement.style.transform = 'translateY(0)';
      pElement.style.scale = 1;
      pElement.style.color = '#727272';
      document.body.removeEventListener('click', handleOutsideClick);
    }
  };


  return (
    <center>
      <div id="header">
        <div id="homeImg"></div>
        <h2>Shibabrata Bhaduri English Tution</h2>
      </div>
      <div>{message}</div>
      <div id='inputField'>
        <p>Enter UUID</p>
        <input type="text" id="adminName" value={adminName} onClick={()=> handelMove()} onChange={e => setAdminName(e.target.value)} />
        <p>Enter UUID</p>
        <input type="password" id="adminCode" value={adminCode} onChange={e => setAdminCode(e.target.value)} />
      </div>
      <button onClick={handleLogin}>Login</button>
    </center>
  );
}

export default AdminLogin;
