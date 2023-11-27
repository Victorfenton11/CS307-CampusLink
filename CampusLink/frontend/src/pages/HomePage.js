import React from 'react'
import './styles/HomePage.css'
import Navbar from '../components/Navbar'
import { Route, Routes } from 'react-router-dom'
import Forum from './Forum'
import Map from './Map'
import Discover from './Discover'
import Circles from './Circles'
import Profile from './Profile'
import Calendar from './Calendar'

export default function HomePage({}) {
  return (
    <div className='container'>
      <div className='page'>
        <Routes>
          <Route path='/' element={<Forum />}/>
          <Route path='/map' element={<Map />}/>
          <Route path='/discover' element={<Discover />}/>
          <Route path='/circles' element={<Circles />}/>
          <Route path='/profile' element={<Profile />}/>
          <Route path='/calendar' element={<Calendar />}/>
        </Routes>
      </div>
      <Navbar className='navbar'/>
    </div>
  )
}