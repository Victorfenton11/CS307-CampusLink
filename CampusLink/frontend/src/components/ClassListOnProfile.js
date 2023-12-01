import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ClassListOnProfile = () => {
  const [classList, setClassList] = useState([]);
  const navigate = useNavigate();

  function handleAddClass(){
    navigate('/class')
  }

  useEffect(() => {
    // Replace the URL with your backend endpoint
    axios.get('/api/getClasses')
      .then(response => {
        setClassList(response.data);
      })
      .catch(error => {
        console.error('Error fetching class list:', error);
      });
  }, []); // Empty dependency array ensures useEffect runs only once on component mount

  return (
    <div className = "profile-class-list-div">
      <h2>Class List</h2>
      <ul className='profile-class-list'>
        {classList.map((classItem) => (
          <li key={classItem.id}>{classItem.abbreviation}-{classItem.name}</li>
        ))}
      </ul>
      <button className='navigate-btn-class' onClick={handleAddClass}>Add Class</button>
    </div>
  );
};

export default ClassListOnProfile;
