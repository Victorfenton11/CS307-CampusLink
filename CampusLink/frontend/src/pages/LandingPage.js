import React, { useState } from 'react';
import '../styles/LandingPage.css';

export default function LandingPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
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
    if (!validateEmail(formData.email)) {
      setEmailError('Please enter a valid Purdue email address');
      return; 
    }
    setEmailError(''); // Clear error message if email is valid
    // Handle form submission logic here
    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('username', formData.username);
    data.append('password', formData.password);
    if (formData.profilePic) {
        data.append('profile_pic', formData.profilePic);
    }
    fetch('/api/user/create/', {
      method: 'POST',
      body: data
    })
    .then(response => response.json())
    .then(data => {
      if (data.email && data.email[0] === 'user with this email already exists.') {
        console.log('Setting error');
        setEmailError('User with this email already exists.');
      } else {
        // console.log('Success:', data);
        console.log('Clearing error');
        setEmailError('');
      }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
  }
  
  return (
    <div className='background'>
      <img src='/static/campuslink.png' alt='Campus link' className='landinglogo'></img>
      <h1>Register an Account</h1>
      {emailError && <p className="error">{emailError}</p>}
      <form onSubmit={handleSubmit} className='form'>
        <label className='label'>
          Name
          <input type="text" name="name"  className='input input_box' onChange={handleChange}/>
        </label>
        <br />
        <label className='label'>
          Email
          <input type="email" name="email" className='input input_box' onChange={handleChange}  />
        </label>
        <br />
        <label className='label'>
          Username
          <input type="text" name="username" className='input input_box' onChange={handleChange} />
        </label>
        <br />
        <label className='label'>
          Password
          <input type="password" name="password" className='input input_box' onChange={handleChange} />
        </label>
        <br />
        <label className='label'>
          Profile Pic
          <input type="file" name="profile_pic"onChange={handleFileChange} />
        </label>
        <br />
        <button type="submit">Sign up</button>
      </form>
    </div>
  );
}
