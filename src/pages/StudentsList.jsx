import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StudentsList = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const admToken = localStorage.getItem('admToken');
        if (admToken) setIsLoggedIn(true);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://fees-management-fe.vercel.app/std-list', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('admToken')}`
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
            const response = await axios.put(`https://fees-management-fe.vercel.app/update-payment/${uuid}`, { isPaid: !isPaid }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('admToken')}`
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
