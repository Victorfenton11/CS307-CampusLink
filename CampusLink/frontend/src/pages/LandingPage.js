import React, {useEffect} from 'react'
import SignUp from './SignUp'
import LogIn from './LogIn'
import HomePage from './HomePage'
import ResetPassword from './ResetPassword'
import ResetPasswordConfirm from './ResetPasswordConfirm'
import { Route, Routes, useNavigate } from 'react-router-dom'


export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/login');
  }, []);

  return (
    <Routes>
      <Route path='/login' element={<LogIn />}/>
      <Route path='/signup' element={<SignUp />}/>
      <Route path='/reset-password' element={<ResetPassword />}/>
      <Route path='/password-reset-confirm/:uid/:token' element={<ResetPasswordConfirm />}/>
      <Route path='*' element={<HomePage />}/>
    </Routes>
  )
}