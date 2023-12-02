import React, { useState } from 'react';
import './styles/ColorPicker.css'

const ColorPicker = (props) => {
  const [selectedColor, setSelectedColor] = useState("#265985");

  const colors = [
    { name: 'Red', colorCode: '#FF0000' },
    { name: 'Blue', colorCode: '#0000FF' },
    { name: 'Green', colorCode: '#008000' },
    { name: 'Yellow', colorCode: '#FFFF00' },
    { name: 'Purple', colorCode: '#800080' },
  ];

  const handleColorChange = (event) => {
    setSelectedColor(event.target.value);
    props.setEventColor(event.target.value);
  };

  return (
    <div className='color-picker'>
      <label htmlFor="colorPicker">Color:</label>
      <select id="colorPicker" onChange={handleColorChange}>
        <option value="#265985">Select a color</option>
        {colors.map((color, index) => (
          <option key={index} value={color.colorCode}>
            {color.name}
          </option>
        ))}
      </select>
      <div className="color-shower">
        {selectedColor && (
          <div>
            <div className='color-ball'
              style={{backgroundColor: selectedColor}}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorPicker;
