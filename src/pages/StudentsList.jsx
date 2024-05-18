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
    const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, studentId: null, studentName: '' });

    //* Get data from local storage [ADMIN or NOT]
    useEffect(() => {
        const admToken = localStorage.getItem('admToken');
        if (admToken) setIsLoggedIn(true);
    }, []);

    //* Get student data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/std-list', {
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

    //* Get month
    useEffect(() => {
        const currentDate = new Date();
        const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
        const currentYear = currentDate.toLocaleString('default', { year: 'numeric' });
        const monthAndYear = currentMonth + ", " + currentYear;
        setDate(monthAndYear);
    }, []);

    //* Payment Handler
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

    //* Search Students
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };
    const filteredStudents = searchTerm.length === 0 ? students : students.filter(student =>
        student.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    //* Delete Student
    const handleConfirmDelete = (uuid, fullName) => {
        setConfirmDelete({ isOpen: true, studentId: uuid, studentName: fullName });
    };

    const handleCancelDelete = () => {
        setConfirmDelete({ isOpen: false, studentId: null, studentName: '' });
    };

    const handleStudentDelete = async () => {
        try {
            const response = await axios.delete(`http://localhost:8000/remove/${confirmDelete.studentId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('admToken')}`
                }
            });
            if (response.status === 200) {
                setStudents(students.filter(student => student.uuid !== confirmDelete.studentId));
            }
            console.log(response.data.message);
        } catch (error) {
            console.error("Error removing student:", error.response ? error.response.data.message : error.message);
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            {isLoggedIn ? (
                <div>
                    <div id="topHead">
                        <h2>{date}</h2>
                        <Link to="/add-std" id="addStd">
                            <MdPersonAddAlt1 style={{ fontSize: "1.5rem", color: "black" }} />
                        </Link>
                    </div>
                    <input
                        type="text"
                        placeholder="Search Name"
                        value={searchTerm}
                        onChange={handleSearch}
                        id='searchBar'
                    />
                    {confirmDelete.isOpen && (
                        <div id='dialogue-box'>

                            <div>
                                <p id='delete-message'>{`Do you want to remove ${confirmDelete.studentName}? Click "OK" to confirm !!!`}</p>
                                <button onClick={handleStudentDelete}>OK</button>
                                <button onClick={handleCancelDelete}>Cancel</button>
                            </div>
                        </div>
                    )}
                    {filteredStudents.length > 0 ? (
                        <ul>
                            {filteredStudents.map(student => (
                                <li key={student.uuid}>
                                    <h3>{student.fullName}</h3>
                                    <p>Class: {student.stdClass}</p>
                                    <p>UUID: {student.uuid}</p>
                                    <p>Phone Number: {student.phone}</p>
                                    <button onClick={() => handleConfirmDelete(student.uuid, student.fullName)}>Delete</button>
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