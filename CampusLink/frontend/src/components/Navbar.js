import React from 'react'
import icon from '../../static/images/icon_mint.png'
import './styles/Navbar.css'
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <div className='navbar'>
        <div className='Home'>
            <Link to='/'><img alt='icon' src={icon} className='icon'/></Link>
        </div>
        <div className='menu'>
          <Link to='/map'><ion-icon name="map-outline"></ion-icon></Link>
          <Link to='/discover'><ion-icon name="search-outline"></ion-icon></Link>
          <ion-icon></ion-icon>
          <Link to='/circles'><ion-icon name="people-outline"></ion-icon></Link>
          <Link to='/profile'><ion-icon name="person-outline"></ion-icon></Link>
        </div>
    </div>
  )
}
