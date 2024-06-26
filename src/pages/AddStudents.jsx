import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {host} from "../main"

const AddStudents = () => {
    const [fullName, setFullName] = useState('');
    const [stdClass, setStdClass] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [message, setMessage] = useState('');
    const [UUID, SetUuid] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    


    useEffect(() => {
        const admToken = localStorage.getItem('admToken');
        if (admToken) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const admToken = localStorage.getItem('admToken');
            if (!admToken) {
                throw new Error("You can't access.");
            }
            const response = await axios.post( host + '/add-std', { fullName, phone: phoneNumber, stdClass }, {
                headers: {
                    'Authorization': `Bearer ${admToken}`
                }
            });
            const { message, newStudent  } = response.data;
            console.log(response.data);
            setMessage(message);
            SetUuid(newStudent.uuid);
        } catch (error) {
            console.error("Error:", error.message);
            setMessage("Student Already Exists");
        }
    };

    return (
        <div>
            {isLoggedIn ? (
                <div>
                    <h2>Add Student</h2>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>Full Name:</label>
                            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                        </div>
                        <div>
                            <label>Class:</label>
                            <input type="text" value={stdClass} onChange={(e) => setStdClass(e.target.value)} />
                        </div>
                        <div>
                            <label>Phone Number</label>
                            <input type="number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                        </div>
                        <button type="submit">Add</button>
                    </form>
                </div>
            ) : (
                <p>You can't access.</p>
            )}
            {message && <p>{message} <br /> UUID is: {UUID}</p>}

        </div>
    )
}

export default AddStudents;
