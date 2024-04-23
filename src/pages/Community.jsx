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
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setMessage('First Login Please...');
          return;
        }
        setIsLoggedIn(true);

        const response = await axios.get('http://localhost:8000/community', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setPostDetails(response.data.postDetails);
        setFilteredPosts(response.data.postDetails);
      } catch (error) {
        console.log(`Error is ${error}`);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedClass === '') {
      setFilteredPosts(postDetails);
    } else {
      setFilteredPosts(postDetails.filter(post => post.forClass === selectedClass));
    }
    localStorage.setItem('selectedClass', selectedClass);
  }, [selectedClass, postDetails]);

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
  };

  return (
    <div>
      {isLoggedIn ? (
        <div>
          <select value={selectedClass} onChange={handleClassChange}>
            <option value="">Select a class</option>
            {postDetails.map((post, index) => (
              <option key={index} value={post.forClass}>Class {post.forClass}</option>
            ))}
          </select>
          {filteredPosts.length === 0 ? "No images" :
            <div>
              {filteredPosts.map((post, index) => (
                <div key={index}>
                  <div>
                    {post.imageUrls.map((imageUrl, i) => (
                      <img key={i} src={`http://localhost:8000/${imageUrl}`} alt={`Image ${i}`} height={100} width={100} />
                    ))}
                  </div>
                  <p>{post.desc}</p>
                </div>
              ))}
            </div>
          }
        </div>
      ) : (
        <p>'First Login Please...'</p>
      )}
    </div>
  );
};

export default Community;
