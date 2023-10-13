import React, { useState } from 'react'
import './styles/LogIn.css'
import { useNavigate,} from 'react-router-dom';
import logo from '../../static/images/CampusLink_white_text.png'

export default function ResetPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');

  function handleSendEmail() {
    return;
  }

  return (
    <div className='login-style'>
      <div className='container'>
        <img src={logo} alt='Campuslink logo' className='landing-logo' />
        <label className='label'>
          Purdue Email
          <input type="text" name="Email-reset"  className='input input_box' onChange={(e) => setEmail(event.target.value)}/>
        </label>
        <button className='landing-button' onSubmit={handleSendEmail}>Send Email</button>
        <button className='landing-button' onClick={() => navigate('/login')}>Back</button>
      </div>
    </div>
  )
}
