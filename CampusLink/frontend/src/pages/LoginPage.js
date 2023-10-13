import React, { useState, useEffect } from 'react';
import ProfilePage from './ProfilePage'
import '../styles/LandingPage.css';

const LoginPage = () => {
    // State to store user data
    const [userData, setUserData] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
      });
    const [userID, setUserID] = useState(3);
    
    // State to track errors
    const [error, setError] = useState(null);
  
    const [credential, setCredential] = useState(false);
    
    // Function to fetch user data from the API
    console.log(formData)
    async function fetchData(username){
      try {
        console.log(username);
        // Make API request
        const response = await fetch('/api/users/' + username);
        
        // Check if the request was successful
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
  
        // Parse JSON response
        const data = await response.json();
        
        // Check if username password matches
        //const parseTheData = JSON.parse(data);
        //console.log(parseTheData);
        console.log("Data", data);
        setUserData(data);
  
      } catch (error) {
        // Set error state
        setError(error.message);

      }
    };


    function checkCredentials(passwordInput, passwordStored, ID) {
        if (passwordInput === passwordStored) {
            setCredential(true);
            console.log("ahhhhhh", ID);
            setUserID(userData.UserID);
        }

    }
    function handleSubmit() {
        fetchData(formData.username);
        console.log(userData);
        //checkCredentials(formData.password, userData.Password);
    }

    useEffect(()=>{
        if (userData != null) {
            checkCredentials(formData.password, userData.Password, userData.UserID);
        }
    },[userData])

  
    // Render error state
    if (error) {
      return <div>Error: {error}</div>;
    }
    
    if (credential) {
        console.log("userID", userID);
        return (
            <ProfilePage userID={userData.UserID}/>
        );
    }
    // Render user profile
    return (
      <div className='background'>
        <div className='container'>
        <label className='label'>
          UserName
          <input type="text" name="username"  className='input input_box' onChange={(e) => setFormData({ ...formData, username: e.target.value })}/>
        </label>
        <br />
        <label className='label'>
          Password
          <input type="password" name="password" className='input input_box' onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
        </label>
        <button onClick={handleSubmit}>Login</button>
          </div>
      </div>
    );
  };
  
  export default LoginPage;