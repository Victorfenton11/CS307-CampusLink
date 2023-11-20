import React from "react";
import './styles/ProfileCard.css'
import FullUserProfile from './FullUserProfile'
//add friend status function

class ProfileCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isExpanded: false };
  }


  render() {
    if (!this.state.isExpanded) {
      return (
        <div className="profilecard-container">
          <div className="name-container">
            <button className="profilecard-exit" onClick={this.props.onExitClick}>X</button>
            <h1>@{this.props.username}</h1>
            <h2>{this.props.name}</h2>
          </div>
          <div className="bio-container">
            <p className="bio">Bio</p>
            <p>{this.props.userbio}</p>
          </div>
          <button onClick={()=>this.setState({isExpanded: true})} className="full-profile-view-button">view full profile</button>
        </div>
      )
    }
    else {
      return (
        <div className="full-profile-container">
          <FullUserProfile onExitClick={this.props.onExitClick} userdata={this.props.userdata}></FullUserProfile>
        </div>
      )
    }
  }
}

export default ProfileCard;