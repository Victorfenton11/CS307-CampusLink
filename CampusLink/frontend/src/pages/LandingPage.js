import React from 'react'
import SignUp from './SignUp'
import LogIn from './LogIn'
import HomePage from './HomePage'
import ResetPassword from './ResetPassword'
import DeletingPage  from './DeletingPage'
import EmailVerification from './EmailVerification'
import { Route, Routes } from 'react-router-dom'

export default function LandingPage() {
  return (
    <Routes>
      <Route path='/login' element={<LogIn />}/>
      <Route path='/signup' element={<SignUp />}/>
      <Route path='/reset-password' element={<ResetPassword />}/>
      <Route path='/deletingpage' element={<DeletingPage />}/>
      <Route path="/verify-email/:uid/:token" element={<EmailVerification />} />
      <Route path='*' element={<HomePage />}/>
    </Routes>
  )
}