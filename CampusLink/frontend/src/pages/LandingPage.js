import React, {useEffect} from 'react'
import SignUp from './SignUp'
import LogIn from './LogIn'
import HomePage from './HomePage'
import ResetPassword from './ResetPassword'
import DeletingPage  from './DeletingPage'
import EmailVerification from './EmailVerification'
import ResetPasswordConfirm from './ResetPasswordConfirm'
import { Route, Routes, useNavigate } from 'react-router-dom'


export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    try {
      if (window.location) {
        const pathname = window.location.pathname;
        if (pathname !== "/login" && pathname !== "/signup" && pathname !== "/reset-password" && pathname.substring(0, 8) !== "password" && pathname.substring(0, 6) !== "verify") {
          const loggedUserID = sessionStorage.getItem('userID');
          if (!loggedUserID) navigate('/login');
        }
      };
    } catch (e) {
      navigate('/login');
    }
  }, []);

  return (
    <Routes>
      <Route path='/login' element={<LogIn />}/>
      <Route path='/signup' element={<SignUp />}/>
      <Route path='/reset-password' element={<ResetPassword />}/>
      <Route path='/deletingpage' element={<DeletingPage />}/>
      <Route path="/verify-email/:uid/:token" element={<EmailVerification />} />
      <Route path='/password-reset-confirm/:uid/:token' element={<ResetPasswordConfirm />}/>
      <Route path='*' element={<HomePage />}/>
    </Routes>
  )
}