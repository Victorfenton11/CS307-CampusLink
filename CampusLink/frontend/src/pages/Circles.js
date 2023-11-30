import React, { useState } from 'react'
import Friends from '../components/Friends'
import Groups from '../components/Groups'
import CustomSwitchSelector from '../components/CustomSwitchSelector'
import "./styles/Circles.css"

export default function Circles() {
  const options = [
    { label: 'Friends', value: 'friends' },
    { label: 'Circles', value: 'circles' },
  ];

  const [selectedOption, setSelectedOption] = useState(options[0].value);;

  const handleOptionChange = (value) => {
    setSelectedOption(value);
  };

  return (
    <div className='circles-page'>
      <CustomSwitchSelector className="switch-selector" options={options} onChange={handleOptionChange} />
      {selectedOption === 'friends' ? <Friends /> : <Groups />}
    </div>
  )
}
