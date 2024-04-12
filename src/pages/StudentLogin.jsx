import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function StudentLogin() {
  const [uuid, setUuid] = useState('');
  const [fullName, setFullName] = useState('');
  const [stdClass, setStdClass] = useState('');
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
      const response = await axios.post('http://localhost:8000/std-login', { uuid, fullName, stdClass });
      const { message, token } = response.data;
      setMessage(message);
      
      // Save the token to localStorage
      localStorage.setItem('token', token);
      setIsLoggedIn(true);
      navigate('/profile'); // Redirect upon successful login
      console.log("Received token:", token);
    } catch (error) {
      console.error("Error:", error.response.data.message);
      setMessage(error.response.data.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <div>
      {isLoggedIn ? (
        <div>
          <p>You are logged in.</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <h2>Student Login</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>UUID:</label>
              <input type="text" value={uuid} onChange={(e) => setUuid(e.target.value)} />
            </div>
            <div>
              <label>Full Name:</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div>
              <label>Class:</label>
              <input type="text" value={stdClass} onChange={(e) => setStdClass(e.target.value)} />
            </div>
            <button type="submit">Login</button>
          </form>
          {message && <p>{message}</p>}
        </div>
      )}
    </div>
  );
}

export default StudentLogin;