import React, { useState, useEffect } from 'react';
import '../styles/TextBox.css'
import Footer from './Footer'
import dum_pic from '../../static/Test.jpg'


const UserProfile = () => {
  // State to store user data
  const [userData, setUserData] = useState(null);
  // State to track loading state
  const [isLoading, setIsLoading] = useState(true);
  // State to track errors
  const [error, setError] = useState(null);

  const [imgError, setImgError] = useState(false);

  const [isEditMode, setIsEditMode] = useState(false);

  // Function to fetch user data from the API
  const fetchUserData = async (userID) => {
    try {
      // Make API request
      const response = await fetch('/api/user/1');
      
      // Check if the request was successful
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      // Parse JSON response
      const data = await response.json();
      
      // Set user data in state
      setUserData(data);
      // Set loading state to false
      setIsLoading(false);
    } catch (error) {
      // Set error state
      setError(error.message);
      // Set loading state to false
      setIsLoading(false);
    }
  };
  const handleEditClick = () => {
    setIsEditMode(true);
  };
  const handleImgError= () => {
    setImgError(true);
  };

  const imageUpload=(e)=>{
    e.preventDefault();

    const formData=new FormData();
    formData.append("file",e.target.files[0],e.target.files[0].name);

    fetch('/api/user/savefile',{
        method:'POST',
        body:formData
    });
    setUserData({ ...userData, PhotoFileName: e.target.files[0].name});
  };

  // Function to handle the "Save" button click
  const handleSaveClick = async (userID) => {
    // Perform logic to save the modified data to the API
    try{
      const response = await fetch('/api/user/1', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error('Failed to save user data');
    }

    // Notify the user that the data was saved successfully
    alert('Successfully changed the profile');

    // Exit edit mode
    setIsEditMode(false);
    } catch (error) {
      console.error('Error saving user data:', error.message);
    }
  };


  // UseEffect hook to fetch data when the component mounts
  useEffect(() => {
    fetchUserData();
  }, []);

  // Render loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Render error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  if (isEditMode) {
    return (
      <div className="background">
        <div className='top'>Edit User Profile</div>
        <label htmlFor="photo-upload" className="custom-file-upload fas">
    <div className="img-wrap img-upload" >
        <img htmlFor="photo-upload" src={imgError ?dum_pic:'../../static/' + userData.PhotoFileName} onError={handleImgError}/>
    </div>
    <input id="photo-upload" type="file" onChange={imageUpload}/> 
    </label>
        <label className='label'>Name:</label>
        <input type="text" value={userData.Name} onChange={(e) => setUserData({ ...userData, Name: e.target.value })} />
        <label className='label'>UserName:</label>
        <input type="text" value={userData.UserName} onChange={(e) => setUserData({ ...userData, UserName: e.target.value })} />
        <label className='label'>Email:</label>
        <input type="text" value={userData.userEmail} onChange={(e) => setUserData({ ...userData, userEmail: e.target.value })} />
        <button onClick={handleSaveClick}>Save</button>
      </div>
    );
  }

  // Render user profile
  return (
    <div className='background'>
      <div className='top'>User Profile</div>
      <label className="custom-file-upload fas">
        <div className="img-wrap" >
            <img htmlFor="photo-upload" src={'../../static/' + userData.PhotoFileName}/>
        </div>
        </label>
        <label className='label'>
          Name:
        <div className='name'>{userData.Name}</div>
        </label>
        <label className='label'>
          UserName:
        <div className='name'> {userData.UserName}</div>
        </label>
        <label className='label'>
          Email:
        <div className='name'>{userData.userEmail}</div>
        </label>
        <button onClick={handleEditClick}>Edit</button>
      <Footer></Footer>
    </div>
  );
};

export default UserProfile;