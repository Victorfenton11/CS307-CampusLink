import React from "react";
import './styles/ProfileCard.css'
//add friend status function
const ProfileCard = ({username, userbio, name, friendstatus}) => (
  <div className="container">
    <div className="name-container">
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