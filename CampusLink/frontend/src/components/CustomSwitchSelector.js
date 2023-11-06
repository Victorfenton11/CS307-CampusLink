import React, { useState } from 'react';
import './styles/CustomSwitchSelector.css';

const CustomSwitchSelector = ({ options, onChange }) => {
  const [selectedOption, setSelectedOption] = useState(options[0].value);

  const handleOptionClick = (value) => {
    setSelectedOption(value);
    onChange(value);
  };

  return (
    <div className="custom-switch-selector">
      {options.map(option => (
        <div
          key={option.value}
          className={`option ${selectedOption === option.value ? 'selected' : ''}`}
          onClick={() => handleOptionClick(option.value)}
        >
          {option.label}
        </div>
      ))}
    </div>
  );
};

export default CustomSwitchSelector;