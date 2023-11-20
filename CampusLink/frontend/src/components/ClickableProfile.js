import React, { useState, useEffect } from "react";
import './styles/ClickableProfile.css'
import ProfileCard from "./ProfileCard";

/**
 * Clickable profile wraps around profile component and expands into a profilecard
 */
class ClickableProfile extends React.Component {

    constructor(props) {
        super(props);
        //add userbio and name
        this.state = { isClicked: false, username: "", name: ""};
    }

    render() {
        const fetchProfileData = async (userID) => {
            try {
                //change to fetch userID prop
                const fetchString = '/api/user/' + this.props.userID;
                const response = await fetch(fetchString);
                if (!response.ok) {
                    //change to alerts library
                    throw new Error('Failed to fetch user data');
                }
                //parse
                const data = await response.json();
                //set data state
                this.setState({username: data.UserName, name: data.Name});
            } catch (error) {
                //change to fetch userID
                throw new Error('Failed to fetch user data');
            }
        }

        if (!this.state.isClicked) {
            return (
                <div className="clickbox">

                    <div className="clickableprofile-container">
                        <div onClick={() => {fetchProfileData(); this.setState({ isClicked: true })}}>
                            <div className="viewable-name">
                                {this.props.username}
                            </div>
                        </div>
                    </div>

                </div>
            )
        } else {
            return (
                <div className="clickbox">
    
                    <div className="clickableprofile-container">
                        <div className="viewable-name">
                            {this.props.username}
                        </div>
                        <div className="miniprofile-container" id="miniprofile-container">
                            <ProfileCard 
                                onExitClick={() => this.setState({ isClicked: false})} 
                                username={this.state.username} 
                                name={this.state.name}>
                            </ProfileCard>
                        </div>
                    </div>
                                    
                </div>
            )
        }
        
      
    }

}

export default ClickableProfile;