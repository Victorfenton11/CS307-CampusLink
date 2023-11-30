import React, { useState, useEffect } from 'react';
import Profile from './Profile'
import './styles/LogIn.css';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../static/images/CampusLink_white_text.png'
import swal from 'sweetalert';

const LoginPage = () => {
  const navigate = useNavigate();
  // State to store user data
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
      username: '',
      password: '',
    });
  
  // State to track errors
  const [error, setError] = useState(null);
  
  // Function to fetch user data from the API
  console.log(formData)
  async function fetchData(username){
    try {
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
      setUserData(data);

    } catch (error) {
      // Set error state
      setError(error.message);

    }
  };


  function checkCredentials(passwordInput, passwordStored, ID) {
    if (passwordInput === passwordStored) {
        return true;
    }
    return false;
  }

  function handleSubmit() {
    fetchData(formData.username);
  }

  useEffect(()=>{
      if (userData != null) {
          if (checkCredentials(formData.password, userData.password, userData.UserID)) {
            sessionStorage.setItem('userID', userData.UserID);
            return navigate('/');
          } else {
            swal("Error!", "Incorrect password", "error");
          }
      }
  },[userData])


  // Render error state
  if (error) {
    return <div>Error: {error}</div>;
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