import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function Profile() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [student, setStudent] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        setIsLoggedIn(true);
        if (!token) {
          throw new Error("You are unauthorized to access this page...");
        }

        const response = await axios.get('https://fees-management-fe.vercel.app/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        setStudent(response.data.existStudent);
        setLoading(false);
      } catch (error) {
        setError(error.response ? error.response.data.message : error.message);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handelLogOut = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false)
    navigate('/std-login')
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Student Profile</h2>
      <p>UUID: {student.uuid}</p>
      <p>Full Name: {student.fullName}</p>
      <p>Class: {student.stdClass}</p>
      {
        (isLoggedIn) && <button onClick={handelLogOut}>Logout</button>
      }
    </div>
  );
}

export default Profile;
