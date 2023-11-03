import React, { useState } from 'react'
import Friends from '../components/Friends'
import Groups from '../components/Groups'
import SwitchSelector from 'react-switch-selector'
import "./styles/Circles.css"

export default function Circles() {
  const [switchPosition, setSwitchPosition] = useState(true);

  const options = [
    {
      label: "Friends",
      value: "friends",
      selectedBackgroundColor: "white"
    },
    {
      label: "Circles",
      value: "circles",
      selectedBackgroundColor: "white"
    }
  ];

  const initialSelectedIndex = options.findIndex(({value}) => value === "friends");

  return (
    <div className='circles-page'>
      <Friends />
    </div>
  )
}
