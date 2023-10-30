import React from 'react'
import SignUp from './SignUp'
import LogIn from './LogIn'
import HomePage from './HomePage'
import ResetPassword from './ResetPassword'
import ResetPasswordConfirm from './ResetPasswordConfirm'
import Activate from './Activate'
import { Route, Routes } from 'react-router-dom'

import { Provider } from 'react-redux'
import { store } from '../store'

export default function LandingPage() {
  return (
    <Provider store={store}>
      <Routes>
        <Route path='/login' element={<LogIn />}/>
        <Route path='/signup' element={<SignUp />}/>
        <Route path='/reset-password' element={<ResetPassword />}/>
        <Route path='/password/reset/confirm/:uid/:token' element={<ResetPasswordConfirm />}/>
        <Route path='/activate/:uid/:token' element={<Activate />}/>
        <Route path='*' element={<HomePage />}/>
      </Routes>
    </Provider>
  )
}