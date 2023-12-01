import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import './styles/importCal.css';

const UrlUploader = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [userId, setUserId] = useState('');

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
    setUserId(1);
    //setUserData({ ...userData, url: e.target.value });
    //setUserData({ ...userData, UserID: 1 });
  };


  const handleUpload = async () => {
    //setUserData({ ...userData, UserID: 1 });
    // Perform logic to save the modified data to the API
    try{
      const response = await fetch('/api/upload/1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        UserID: userId,
        url: url,
      }),
    });
    if (url.endsWith('ics')) {
      navigate('/calendar');
    }
    else {
      swal({
        title: "Invalid URL",
        text: "Please enter an valid url",
        icon: "warning",
        button: "OK",
      });
    }
    if (!response.ok) {
      throw new Error('Failed to save user data');
    }
    } catch (error) {
      console.error('Error saving user data:', error.message);
    }
  };


  return (
    <div className='center-container-cal'>
      <label className='label-cal' htmlFor="urlInput">Add by URL:  </label>
      <input
        className='input-cal'
        type="text"
        id="urlInput"
        value={url}
        onChange={handleUrlChange}
        placeholder="Enter URL here"
      />

      <button className='upload-button-Cal' onClick={handleUpload}>Upload</button>

    </div>
  );
};

export default UrlUploader;