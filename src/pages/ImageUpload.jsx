import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ImageUpload = () => {
    const [desc, setDesc] = useState('');
    const [forClass, setForClass] = useState('');
    const [images, setImages] = useState([]);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('')
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleFileChange = (e) => {
        setImages([...e.target.files]);
    };

    const handleDescChange = (e) => {
        setDesc(e.target.value);
    };

    const handleForClassChange = (e) => {
        setForClass(e.target.value);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("You are unauthorized to access this page...");
            }

            const formData = new FormData();
            formData.append('desc', desc);
            formData.append('forClass', forClass);
            images.forEach((image) => {
                formData.append('images', image);
            });

            const response = await axios.post('http://localhost:8000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            setDesc('');
            setForClass('');
            setImages([]);
            if (response.status === 200) {
                setMessage("Image uploaded successfully");
                setTimeout(() => {
                    setMessage('')
                }, 2000);
            }
            console.log(response);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div>
            {isLoggedIn ? (
                <>
                    <input type="file" id="images" name="images" accept="image/png, image/jpeg" multiple onChange={handleFileChange} />
                    <label htmlFor="desc">Description</label>
                    <input type="text" name='desc' id='desc' value={desc} onChange={handleDescChange} />
                    <select name="forClass" id="forClass" value={forClass} onChange={handleForClassChange}>
                        <option value="">Select a class</option>
                        <option value="8">Class 8</option>
                        <option value="9">Class 9</option>
                        <option value="10">Class 10</option>
                        <option value="11">Class 11</option>
                        <option value="12">Class 12</option>
                    </select>
                    <button type='submit' onClick={handleSubmit}>Add</button>
                    {error && <div style={{ color: 'red' }}>{error}</div>}
                    <div style={{ color: "green" }}>{message}</div>
                </>
            ) : (
                <p>Please login to upload images.</p>
            )}
        </div>
    );
};

export default ImageUpload;
