import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import "../styles/studentLogin.css"
import { host } from '../main';

function StudentLogin() {
  const [uuid, setUuid] = useState('');
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(host + '/std-login', { uuid });
      const { message, token } = response.data;
      setMessage(message);

      localStorage.setItem('token', token);
      setIsLoggedIn(true);
      navigate('/profile');
    } catch (error) {
      console.error("Error:", error.response.data.message);
      setMessage(error.response.data.message);
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
    <center id='StdLoginContainer'>
      <div id="header">
        <div id="homeImg"></div>
        <h2>Shibabrata Bhaduri English Tution</h2>
      </div>
      <div>
      {message && <p style={{color: 'red', marginBottom: "1rem"}}>{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className='inputField'>
            <p>Enter UUID</p>
            <input type="text" onClick={() => handelMove()} value={uuid} onChange={(e) => setUuid(e.target.value)} />
          </div>
          <button style={{cursor: "pointer"}} type="submit">LOGIN</button>
        </form>
        <Link id='link' to='/admin-login'>Login as admin?</Link>
      </div>
        
    </center>
  );
}

export default StudentLogin;
