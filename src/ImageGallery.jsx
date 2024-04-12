import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ImageGallery() {
    const [images, setImages] = useState([]);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const response = await axios.get('http://localhost:8000/images');
            setImages(response.data);
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    };

    return (
        <div>
            <h1>Image Gallery</h1>
            <div className="gallery">
                {images.map(image => (
                    <div key={image._id} className="image-item">
                        <img src={`data:${image.contentType};base64,${Buffer.from(image.data).toString('base64')}`} alt={image.name} />
                        <p>{image.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ImageGallery;
