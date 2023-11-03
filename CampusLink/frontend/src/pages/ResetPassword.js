import React, { useState } from 'react'
import './styles/LogIn.css'
import { useNavigate,} from 'react-router-dom';
import logo from '../../static/images/CampusLink_white_text.png'
import swal from 'sweetalert'
import axios from 'axios';

const ResetPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');

  function handleSendEmail(e) {
    e.preventDefault();
    if (email === '') return;

    fetch('/api/reset-password' + '?email=' + email).then((response) => 
      response.json()
    ).then((data) => {
      if (JSON.stringify(data) === '{}') {
        swal("Error!", "The provided email is not associated with any existing accounts.", "error");
      } else {
        swal("Email Sent!", "Check your email for a link to reset your password", "success");
      }
    });

    setEmail('');
    return;
  }

  return (
    <div className='login-style'>
      <div className='container'>
        <img src={logo} alt='Campuslink logo' className='landing-logo' />
        <form action='' onSubmit={handleSendEmail}>
          <label className='label'>
            Purdue Email
            <input type="text" name="Email-reset" value={email} className='input input_box' onChange={(e) => setEmail(e.target.value)}/>
          </label>
          <button type="submit" className='landing-button'>Send Email</button>
        </form>
        <button className='landing-button' onClick={() => navigate('/login')}>Back</button>
      </div>
    </div>
  );
};

export default ResetPassword;