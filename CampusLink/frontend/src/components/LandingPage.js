import React, { useState } from 'react';
import './LandingPage.css';

export default function LandingPage() {
  const [formData, setFormData] = useState({
    Name: '',
    Email: '',
    username: '',
    password: '',
    profilePic: null,
  });

  //this will handle the non-purdue email
  const [emailError, setEmailError] = useState('');

  function validateEmail(email) {
    const re = /^[^\s@]+@purdue\.edu$/;
    return re.test(String(email).toLowerCase());
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function handleFileChange(e) {
    setFormData({
      ...formData,
      profilePic: e.target.files[0],
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validateEmail(formData.Email)) {
      setEmailError('Please enter a valid Purdue email address');
      return; 
    }
    setEmailError(''); // Clear error message if email is valid
    // Handle form submission logic here
  }
  

  return (
    <div className='background'>
      <img src='/static/campuslink.png' alt='Campus link' className='logo'></img>
      <h1>Register an Account</h1>
      {emailError && <p className="error">{emailError}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Name
          <input type="text" name="Name"  className='input_box' onChange={handleChange} />
        </label>
        <br />
        <label>
          Email
          <input type="email" name="Email" className='input_box' onChange={handleChange}  />
        </label>
        <br />
        <label>
          Username
          <input type="text" name="username" className='input_box' onChange={handleChange} />
        </label>
        <br />
        <label>
          Password
          <input type="password" name="password" className='input_box' onChange={handleChange} />
        </label>
        <br />
        <label>
          Profile Pic
          <input type="file" onChange={handleFileChange} />
        </label>
        <br />
        <button type="submit">Sign up</button>
      </form>
    </div>
  );
}
