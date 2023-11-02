import React, { useState, useEffect } from 'react'
import './styles/LogIn.css'
import { useNavigate, useParams} from 'react-router-dom';
import logo from '../../static/images/CampusLink_white_text.png'
import swal from 'sweetalert'
import axios from 'axios';

const ResetPasswordConfirm = () => {
  const navigate = useNavigate();
  const { uid, token } = useParams();

  const [userData, setUserData] = useState('Security Quesiton');
  const [sqa, setSqa] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [reNewPassword, setReNewPassword] = useState('');

  useEffect(()=>{
    const fetchData = async () => {
        await fetch('/api/get-security-question', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({uid: uid, token: token})
        }).then((response) => 
        response.json()
        ).then((data) => {
        if (JSON.stringify(data) === '{}') {
            swal("Error!", "Invalid Request.", "error");
            navigate('/login');
        } else {
            setUserData(data);
            console.log(data);
        }
        });
    }

    fetchData().catch(console.error);
},[])

  const handleResetPassword = async (event) => {
    event.preventDefault();
    //TODO password requirements validation

    if (newPassword !== reNewPassword) {
        swal("Error!", "Passwords do not match", "error");
        return;
    }

    if (sqa !== userData.securityAnswer) {
      swal("Error!", "Incorrect answer to security question.", "error");
      return;
    }

    userData.password = newPassword;

    try {
        const response = await fetch('/api/user/' + userData.UserID, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        });
        if (!response.ok) {
          throw new Error('Failed to save user data');
        }
        
        swal("Success!", "Successfully changed your password", "success");
        navigate('/login');
    } catch (error) {
        console.error('Error saving user data:', error.message);
    }

    return;
  }

  return (
    <div className='login-style'>
      <div className='container'>
        <img src={logo} alt='Campuslink logo' className='landing-logo' />
        <form action='' onSubmit={handleResetPassword}>
          <label className='label'>
            {userData.securityQuestion}
            <input type="text" name="sqa" value={sqa} className='input input_box' onChange={(e) => setSqa(e.target.value)}/>
          </label>
          <label className='label'>
            New Password
            <input type="password" name="new-password" value={newPassword} className='input input_box' onChange={(e) => setNewPassword(e.target.value)}/>
          </label>
          <label className='label'>
            Confirm New Password
            <input type="password" name="re-new-password" value={reNewPassword} className='input input_box' onChange={(e) => setReNewPassword(e.target.value)}/>
          </label>
          <button type="submit" className='landing-button'>Reset Password</button>
        </form>
        <button className='landing-button' onClick={() => navigate('/login')}>Back</button>
      </div>
    </div>
  );
};

export default ResetPasswordConfirm;