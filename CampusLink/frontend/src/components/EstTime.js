import React from 'react'
import './styles/EstTime.css'

export default function EstTime(props) {
  return (
    <div className='estTime'>
        Estimated Time: {props.estTime}
    </div>
  )
}
