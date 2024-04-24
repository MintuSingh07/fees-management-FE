import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Community = () => {
  const [postDetails, setPostDetails] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedClass, setSelectedClass] = useState(() => {
    const storedClass = localStorage.getItem('selectedClass');
    return storedClass || '';
  });
  const [classOptions, setClassOptions] = useState([]);
  const [modelImage, setModelImage] = useState('');
  const [zoomedImage, setZoomedImage] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setMessage('First Login Please...');
          return;
        }
        setIsLoggedIn(true);

        const response = await axios.get('https://fees-management-be.onrender.com/community', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setPostDetails(response.data.postDetails);

        const uniqueClasses = [...new Set(response.data.postDetails.map(post => post.forClass))];
        setClassOptions(uniqueClasses);

      } catch (error) {
        console.log(`Error is ${error}`);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedClass', selectedClass);
  }, [selectedClass]);

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
  };

  const handelZoomIn = (imageUrl) => {
    setModelImage(imageUrl);
    setZoomedImage(true)
  }

  const handelZoomOut = () => {
    setModelImage('');
    setZoomedImage(false);
  }

  return (
    <div>
      {isLoggedIn ? (
        <div>
          <select value={selectedClass} onChange={handleClassChange}>
            <option value="">Select a class</option>
            {classOptions.map((classOption, index) => (
              <option key={index} value={classOption}>Class {classOption}</option>
            ))}
          </select>
          {postDetails.length === 0 ? "No images" :
            <div>
              {postDetails
                .filter(post => post.forClass === selectedClass)
                .map((post, index) => (
                  <div key={index}>
                    <div>
                      {post.imageUrls.map((imageUrl, i) => (
                        <img
                          key={i}
                          src={`https://fees-management-be.onrender.com/${imageUrl}`}
                          alt={`Image ${i}`}
                          height={100}
                          width={100}
                          onClick={()=> handelZoomIn(`https://fees-management-be.onrender.com/${imageUrl}`)}
                        />
                      ))}
                    </div>
                    <p>{post.desc}</p>
                  </div>
                ))}
            </div>
          }
          {zoomedImage && (
            <div>
              <button onClick={()=> handelZoomOut()}>Close</button>
              <img src={modelImage} alt='image' height= {500} width={500}/>
            </div>
          )}
        </div>
      ) : (
        <p>'First Login Please...'</p>
      )}
    </div>
  );
};

export default Community;
