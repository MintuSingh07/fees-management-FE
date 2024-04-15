import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [adminName, setAdminName] = useState('');
    const [adminCode, setAdminCode] = useState('');
    const [error, setError] = useState('');
    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/admin-login', { adminName, adminCode });
            const { token, message } = response.data;
            localStorage.setItem('adminToken', token);
            navigate("/std-list");
            console.log(message); // You can replace this with your redirection logic
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    return (
        <div>
            <h2>Admin Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="adminName">Admin Name:</label>
                    <input
                        type="text"
                        id="adminName"
                        value={adminName}
                        onChange={(e) => setAdminName(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="adminCode">Admin Code:</label>
                    <input
                        type="password"
                        id="adminCode"
                        value={adminCode}
                        onChange={(e) => setAdminCode(e.target.value)}
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default AdminLogin;
