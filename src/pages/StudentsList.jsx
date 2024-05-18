import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../styles/studentsList.css";
import { MdPersonAddAlt1 } from "react-icons/md";
import { Link } from 'react-router-dom';

const StudentsList = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [students, setStudents] = useState([]);
    const [date, setDate] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const admToken = localStorage.getItem('admToken');
        if (admToken) setIsLoggedIn(true);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://fees-management-be.onrender.com/std-list', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('admToken')}`
                    }
                });
                setStudents(response.data);
            } catch (error) {
                console.error("Error fetching student data:", error.response ? error.response.data.message : error.message);
            }
        };

        if (isLoggedIn) {
            fetchData();
        }
    }, [isLoggedIn]);

    useEffect(() => {
        const currentDate = new Date();
        const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
        const currentYear = currentDate.toLocaleString('default', { year: 'numeric' });
        const monthAndYear = currentMonth + ", " + currentYear;
        setDate(monthAndYear);
    }, []);

    const handleCheckboxChange = async (uuid, isPaid) => {
        try {
            const response = await axios.put(`http://localhost:8000/update-payment/${uuid}`, { isPaid: !isPaid }, {
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
            console.error("Error updating payment status:", error.response ? error.response.data.message : error.message);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredStudents = searchTerm.length === 0 ? students : students.filter(student =>
        student.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ padding: "2rem" }}>
            {isLoggedIn ? (
                <div>
                    <div id="topHead">
                        <h2>{date}</h2>
                        <Link to="/add-std" id="addStd">
                            <MdPersonAddAlt1 style={{fontSize: "1.5rem", color: "black"}}/>
                        </Link>
                    </div>
                    <input
                        type="text"
                        placeholder="Search Name"
                        value={searchTerm}
                        onChange={handleSearch}
                        id='searchBar'
                    />
                    {filteredStudents.length > 0 ? (
                        <ul>
                            {filteredStudents.map(student => (
                                <li key={student.uuid}>
                                    <h3>{student.fullName}</h3>
                                    <p>Class: {student.stdClass}</p>
                                    <p>UUID: {student.uuid}</p>
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
            ) : (
                <p>Please Login First...</p>
            )}
        </div>
    );
}

export default StudentsList;
