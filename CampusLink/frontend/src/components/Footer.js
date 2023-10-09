import React from "react";
import Logo from "./Logo"
import "./styles/Footer.css";
import { render } from "react-dom";

const Footer = () => (
    <div className="footerWrapper"> 
        <div>
            <Logo style={{height: "30%", width: "30%"}}></Logo>
        </div>
        <div className="contentWrapper">
            <h3>CampusLink</h3>
            <div className="linksColumn">
                <h3>header</h3>
                <p>linkcol</p>
                <p>linkcol</p>
            </div>
            <div className="linksColumn">
                <h3>header</h3>
                <p>linkcol</p>
            </div>
            <div className="linksColumn">
                <h3>header</h3>
                <p>linkcol</p>
                <p>linkcol</p>
            </div>
        </div>
    </div>
);

export default Footer;