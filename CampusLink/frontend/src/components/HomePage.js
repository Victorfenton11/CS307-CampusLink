import React from 'react'
import '../styles/HomePage.css'
import icon from '../../static/images/icon_cyan.png'

export default function HomePage() {
  return (
    <div className='container'>
      <div className='content'>HomePage</div>
      <div className='navbar'>
        <div className='Location nav-icon'></div>
        <div className='Discover nav-icon'></div>
        <div className='Home nav-icon'>
          <img alt='icon' src={icon} className='icon' />
        </div>
        <div className='Groups nav-icon'></div>
        <div className='Profile nav-icon'></div>

      </div>
    </div>
  )
}