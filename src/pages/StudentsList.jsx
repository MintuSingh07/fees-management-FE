import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StudentsList = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) setIsLoggedIn(true);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/std-list', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setStudents(response.data);
            } catch (error) {
                console.error("Error:", error.response.data.message);
            }
        };

        if (isLoggedIn) {
            fetchData();
        }
    }, [isLoggedIn]);

    const handleCheckboxChange = async (uuid, isPaid) => {
        try {
            const response = await axios.put(`http://localhost:8000/update-payment/${uuid}`, { isPaid: !isPaid }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            // Update the local state with the updated student
            setStudents(students.map(student => {
                if (student.uuid === uuid) {
                    return { ...student, isPaid: !isPaid };
                }
                return student;
            }));
            console.log(response.data.message);
        } catch (error) {
            console.error("Error:", error.response.data.message);
        }
    };

    return (
        <div>
            <h2>Students List</h2>
            {students.length > 0 ? (
                <ul>
                    {students.map((student, index) => (
                        <li key={index}>
                            <p>Full Name: {student.fullName}</p>
                            <p>Class: {student.stdClass}</p>
                            <p>Phone Number: {student.phone}</p>
                            {student.isPaid ? (
                                <p style={{ color: 'green', fontWeight: 600 }}>Paid</p>
                            ) : (
                                <label>
                                    Paid: 
                                    <input
                                        type="checkbox"
                                        checked={student.isPaid}
                                        onChange={() => handleCheckboxChange(student.uuid, student.isPaid)}
                                    />
                                </label>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No students found.</p>
            )}
        </div>
    );
}

export default StudentsList;
