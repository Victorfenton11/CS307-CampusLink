import React from "react";
import './styles/FullUserProfile.css'

class FullUserProfile extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {

        return (
            <div className="full-profile-container">
                <div className="top-profile-container">
                    <button className="fullprofilecard-exit" onClick={this.props.onExitClick}>X</button>

                    <div className="profile-img" >
                        <img src={'../../static/images/' + this.props.userdata.PhotoFileName} />
                    </div>
                </div>
                <div className="bottom-profile-container">
                    <div className="name-username-container">
                        <h1>@{this.props.userdata.UserName}</h1>
                    </div>
                    <div className="moreinfo-container">
                        <div className="fullname-container">
                            <h2>Name: {this.props.userdata.Name}</h2>
                            <h2>Major: {this.props.userdata.Major}</h2>
                        </div>
                        <div className="bio-container">
                            <h2>bio</h2>
                            <div className="bio-descrip">
                                <p>this is my bio! this is my bio! 
                                this is my bio! this is my bio! this is my bio!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )

    }
}

export default FullUserProfile;