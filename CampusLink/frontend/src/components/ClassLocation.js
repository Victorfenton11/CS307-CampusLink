import React from 'react'
import './styles/ClassLocation.css'

export default function ClassLocation(props) {
  return (
    <div className='class-container'>
        <h2 className='title'>Class Location</h2>
        <ul>
            <li>Building: {props.building}</li>
            <li>Floor: {props.floor}</li>
            <li>Room: {props.room}</li>
        </ul>
    </div>
  )
}
