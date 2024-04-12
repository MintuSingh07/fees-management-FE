import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Profile() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error("No token found");
        }

        const response = await axios.get('http://localhost:8000/profile', {
          headers: {
            Authorization: `${token}`,
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
    </div>
  );
}

export default Profile;
