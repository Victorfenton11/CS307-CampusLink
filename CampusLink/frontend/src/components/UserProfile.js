import React, { useState, useEffect } from 'react';
import '../styles/TextBox.css'

const Name =({
  value
})=>
  <div className="field">
    <label htmlFor="name">
      name:
    </label>
    <input 
      id="name" 
      type="text" 
      maxLength="25" 
      value={value} 
      placeholder="Alexa" 
      required/>
  </div>

const UserProfile = () => {
  // State to store user data
  const [userData, setUserData] = useState(null);
  // State to track loading state
  const [isLoading, setIsLoading] = useState(true);
  // State to track errors
  const [error, setError] = useState(null);

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

  // Render user profile
  return (
    <div className='background'>
      <div className='top'>User Profile</div>
        <label className='label'>
          Name:
        <div className='name'>{userData.Name}</div>
        </label>
        <label className='label'>
          UserName:
        <div className='name'>{userData.UserName}</div>
        </label>
        <label className='label'>
          Email:
        <div className='name'>{userData.userEmail}</div>
        </label>
      {/* Add more fields as needed */}
    </div>
  );
};

export default UserProfile;