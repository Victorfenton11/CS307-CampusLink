import React from "react";
import './styles/ClickableProfile.css'
import ProfileCard from "./ProfileCard";

class ClickableProfile extends React.Component {

    constructor(props) {
        super(props);
        this.state = { isClicked: false };
    }

    render() {
        const fetchProfileData = async (userID) => {
            
        }
        if (!this.state.isClicked) {
            return (
                <div className="clickableprofile-container">
                    <div onClick={() => this.setState({ isClicked: true })}>
                        {this.props.username}
                    </div>
                </div>
            )
        } else {
            return (
                <div className="clickableprofile-container">
                    <p>{this.props.username}</p>
                    <div className="miniprofile-container">
                        <ProfileCard username={this.props.username}></ProfileCard>
                    </div>
                </div>
            )
        }
      
    }

}

export default ClickableProfile;