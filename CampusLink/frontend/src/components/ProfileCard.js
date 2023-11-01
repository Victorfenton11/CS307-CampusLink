import React from "react";
import './styles/ProfileCard.css'
//add friend status function
const ProfileCard = ({username, userbio, name, friendstatus, onExitClick}) => (
  <div className="profilecard-container">
    <div className="name-container">
      <button className="profilecard-exit" onClick={onExitClick}>X</button>
      <h1>@{username}</h1>
      <h2>{name}</h2>
    </div>
    <div className="bio-container">
      <p className="bio">Bio:</p>
      <p>{userbio}</p>
    </div>
    
    
  </div>
);

export default ProfileCard;