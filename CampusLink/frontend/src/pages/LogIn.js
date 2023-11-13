import React, { useState, useEffect } from 'react';
import Profile from './Profile'
import './styles/LogIn.css';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../static/images/CampusLink_white_text.png'

const LoginPage = () => {
  const navigate = useNavigate();
  // State to store user data
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
      username: '',
      password: '',
    });
  const [userID, setUserID] = useState(1);
  
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

  async function sha1(message) {
    const msgBuffer = new TextEncoder().encode(message); // Encode as UTF-8
    const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer); // Hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // Convert buffer to byte array
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // Convert bytes to hex string
    return hashHex;
  }
  
  async function checkCredentials(passwordInput, passwordStored, ID) {
    passwordInput = await sha1(passwordInput)
    console.log(passwordInput)
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
      sessionStorage.setItem('userID', userID);
      return navigate('/');
  }
  // Render user profile
  return (
    <div className='login-style'>
      <div className='container'>
        <img src={logo} alt='Campuslink logo' className='landing-logo' />
        <label className='label'>
          UserName
          <input type="text" name="username"  className='input input_box' onChange={(e) => setFormData({ ...formData, username: e.target.value })}/>
        </label>
        <br />
        <label className='label'>
          Password
          <input type="password" name="password" className='input input_box' onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
        </label>
        <div className="inline-quesiton small-text">
          Forgot your password?
          <Link to='/reset-password'>Reset Password</Link>
        </div>
        <button className='landing-button' onClick={handleSubmit}>Login</button>
        <div className="inline-quesiton medium-text">
          Don't have an account yet?
          <Link to='/signup'>Sign Up</Link>
        </div>
      </div>
    </div>
  );
};
  
export default LoginPage;