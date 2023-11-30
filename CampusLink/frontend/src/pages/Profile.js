import React, { useState, useEffect } from 'react';
import './styles/Profile.css'
import dum_pic from '../../static/images/Test.jpg'
import { Link, useNavigate } from 'react-router-dom';


const Profile = () => {
  const navigate = useNavigate();
  // State to store user data
  const [userData, setUserData] = useState(null);
  // State to track loading state
  const [isLoading, setIsLoading] = useState(true);
  // State to track errors
  const [error, setError] = useState(null);

  const [imgError, setImgError] = useState(false);

  const [isEditMode, setIsEditMode] = useState(false);

  const [isPrivate, setIsPrivate] = useState(false);


  const handleSignOut = () => {

    sessionStorage.removeItem('userID');

    navigate('/login');
  };

  const redirectToDeletingPage = () => {
    navigate('/deletingpage'); 
  };

  // Function to fetch user data from the API
  const fetchUserData = async (userID) => {
    try {
      // Make API request
      const userID = sessionStorage.getItem('userID');
      const response = await fetch(`/api/user/${userID}`);
      
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
  const onClickHandler = () => {
    imageGalleryRef.current.fullscreen();
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
      const userID = sessionStorage.getItem('userID');
      const response = await fetch(`/api/user/${userID}`, {
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
    setImgError(false);
    } catch (error) {
      console.error('Error saving user data:', error.message);
    }
  };

  function handlePrivate() {
    setIsPrivate(true);
    setUserData({ ...userData, isPrivate: true});
  }
  function handlePublic() {
    setIsPrivate(false);
    setUserData({ ...userData, isPrivate: false});
  }

  function handleCalendarClick() {
    return navigate('/calendar');
  }

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
      <div className="profile-style">
        <div className='top'>Edit User Profile</div>
        <label htmlFor="photo-upload" className="custom-file-upload fas">
        <div className="img-wrap img-upload" >
            <img htmlFor="photo-upload" src={imgError ?dum_pic:'../../static/images/' + userData.PhotoFileName} onError={handleImgError}/>
        </div>
        <input id="photo-upload" type="file" onChange={imageUpload}/> 
        </label>
        <label className='label'>Name:</label>
        <input type="text" value={userData.Name} onChange={(e) => setUserData({ ...userData, Name: e.target.value })} />
        <label className='label'>UserName:</label>
        <input type="text" value={userData.UserName} onChange={(e) => setUserData({ ...userData, UserName: e.target.value })} />
        <label className='label'>Email:</label>
        <input type="text" value={userData.UserEmail} onChange={(e) => setUserData({ ...userData, UserEmail: e.target.value })} />
        <label className='label'>Phone Number:</label>
        <input type="text" value={userData.PhoneNumber} onChange={(e) => setUserData({ ...userData, PhoneNumber: e.target.value })} />
        <label className='label'>Major:</label>
        <input type="text" value={userData.Major} onChange={(e) => setUserData({ ...userData, Major: e.target.value })} />
        <div className="privacy-buttons">
          <button onClick={handlePrivate}>I want my information to be private</button>
          <button onClick={handlePublic}>I want my information to be public</button>
        </div>
        <button className='save-btn-edit' onClick={handleSaveClick}>Save</button>
      </div>
    );
  }

  if (userData.isPrivate) {
    return (
      <div className='profile-style'>
      <label htmlFor="photo-upload" className="custom-file-upload fas">
        <div className="img-wrap img-upload" >
            <img htmlFor="photo-upload" src={imgError ?dum_pic:'../../../Photos/' + userData.PhotoFileName} onError={handleImgError}/>
        </div>
        </label>
        <div className='profile-names'>
          <div className='name'>{userData.Name}</div>
          <div className='name'>{userData.UserName}</div>
        </div>
        <div className='profile-moreinfo'>
          <p>email - {userData.UserEmail}</p>
          <p>major - {userData.Major}</p>
          <p>interests - {userData.Interest}</p>
          <div className='profile-bio'>
            {userData.UserBio}
          </div>
        </div>
        <button className="edit-button" onClick={handleEditClick}>Edit</button>
        <button onClick={handleCalendarClick}>My Calendar</button>
        <button onClick={handleSignOut}>Sign Out</button>
        <button onClick={redirectToDeletingPage}>Delete Account</button>
    </div>
    )
  }

  // Render user profile
  return (
    <div className='profile-style'>
      <label htmlFor="photo-upload" className="custom-file-upload fas">
        <div className="img-wrap img-upload" >
            <img htmlFor="photo-upload" src={imgError ?dum_pic:'../../../Photos/' + userData.PhotoFileName} onError={handleImgError}/>
        </div>
        </label>
        <div className='profile-names'>
          <div className='name'>{userData.Name}</div>
          <div className='name'>{userData.UserName}</div>
        </div>
        <div className='profile-moreinfo'>
          <p>email - {userData.UserEmail}</p>
          <p>major - {userData.Major}</p>
          <p>interests - {userData.Interest}</p>
          <div className='profile-bio'>
            {userData.UserBio}
          </div>
        </div>
        <button className="edit-button" onClick={handleEditClick}>Edit</button>
        <div className='bap'>
          <button onClick={handleCalendarClick}>My Calendar</button>
          <button onClick={handleSignOut}>Sign Out</button>
          <button onClick={redirectToDeletingPage}>Delete Account</button>
        </div>
    </div>
  );
};

export default Profile;