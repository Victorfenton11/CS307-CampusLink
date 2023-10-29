import React, { useState } from 'react';
import './styles/SignUp.css'
import logo from '../../static/images/CampusLink_white_text.png'
import { Link } from 'react-router-dom';

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    profilePic: null,
    securityQuestion: '', // New field for security question
    securityAnswer: '',   // New field for security answer
  });

  const predefinedSecurityQuestions = [
    'What is your mother\'s maiden name?',
    'What is the name of your first pet?',
    'What is your favorite movie?',
  ];

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
    data.append('Name', formData.name);
    data.append('UserEmail', formData.email);
    data.append('UserName', formData.username);
    data.append('Password', formData.password);
    data.append('Major', '');
    data.append('Interest', '');
    data.append('securityQuestion', formData.securityQuestion);
    data.append('securityAnswer', formData.securityAnswer);
    if (formData.profilePic) {
        data.append('photoFileName', formData.profilePic);
    }
    fetch('/api/user/create/', {
      method: 'POST',
      body: data
    })
    .then(response => response.json())
    .then(data => {
      if (data.UserEmail && data.UserEmail[0] === 'user with this UserEmail already exists.') {
        console.log('Setting error');
        setEmailError('User with this email already exists.');
      }
      else if (data.UserName && data.UserName[0] === "user with this UserName already exists.") {
        console.log('Setting error');
        setEmailError('User with this username already exists.');
      } 
      else {
        console.log('Success:', data);
        console.log('Clearing error');
        setEmailError('');
      }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
  }
  
  return (
    <div className='signup-style'>
      <img src={logo} alt='Campus link' className='landing-logo'></img>
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
          <input type="file" className='file-input' name="profile_pic" onChange={handleFileChange} />
        </label>
        <br />
        <label className='label'>
          Security Question
          <select name="securityQuestion" className='input' onChange={handleChange}>
            <option value="">Select a security question</option>
            {predefinedSecurityQuestions.map((question, index) => (
              <option key={index} value={question}>
                {question}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label className='label'>
          Security Answer
          <input type="text" name="securityAnswer" className='input input_box' onChange={handleChange} />
        </label>
        <br />
        <button className='landing-button' type="submit">Sign up</button>
      </form>
      <div className="inline-quesiton medium-text">
        Already have an account?
        <Link to='/login'>Log in</Link>
      </div>
    </div>
  );
}