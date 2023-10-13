import React from 'react'
import SignUp from './SignUp'
import LogIn from './LogIn'
import HomePage from './HomePage'
import './styles/LandingPage.css'
import { Link } from 'react-router-dom'
import logo from '../../static/images/CampusLink_white_text.png'

export default function LandingPage() {
  return (
    <div className='container'>
      <img src={logo} alt='Campuslink logo' className='landing-logo' />
      <Link to='/signup'><button class='landing-button'>Sign Up</button></Link>
      <Link to='/login'><button class='landing-button'>Log In</button></Link>
    </div>
  )
}