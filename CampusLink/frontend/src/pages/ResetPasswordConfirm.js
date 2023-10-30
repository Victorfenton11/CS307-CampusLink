import React, { useState } from 'react'
import './styles/LogIn.css'
import { useNavigate,} from 'react-router-dom';
import logo from '../../static/images/CampusLink_white_text.png'
import swal from 'sweetalert';
import { connect } from 'react-redux';
import { reset_password_confirm } from '../actions/auth';

const ResetPasswordConfirm = ({ match, reset_password_confirm }) => {
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [reNewPassword, setReNewPassword] = useState('');
  const [requestSent, setRequestSent] = useState(false);

  function handleSend(e) {
    e.preventDefault();

    const uid = match.params.uid;
    const token = match.params.token;

    reset_password_confirm(uid, token, new_password, re_new_password);
    setRequestSent(true);

    return;
  }

  if (requestSent) {
    return () => navigate('/login');
  }

  return (
    <div className='login-style'>
      <div className='container'>
        <img src={logo} alt='Campuslink logo' className='landing-logo' />
        <form action='' onSubmit={handleSend}>
          <label className='label'>
            New Password
            <input type="password" name="new_password" value={newPassword} className='input input_box' onChange={(e) => setNewPassword(e.target.value)} required/>
          </label>
          <label className='label'>
            Confirm New Password
            <input type="password" name="re_new_password" value={reNewPassword} className='input input_box' onChange={(e) => setReNewPassword(e.target.value)} required/>
          </label>
          <button type="submit" className='landing-button'>Reset Password</button>
        </form>
        <button className='landing-button' onClick={() => navigate('/login')}>Back</button>
      </div>
    </div>
  );
};

export default connect(null, { reset_password_confirm })(ResetPasswordConfirm);