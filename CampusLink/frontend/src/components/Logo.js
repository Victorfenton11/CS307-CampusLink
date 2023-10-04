import React from "react";
import small_logo from "../../static/img/logo_small.png"
import { render } from "react-dom";

const Logo = ({style}) => (
    
    <div className="logoWrapper"> 
         <img className="logo" src={small_logo}
         style={style}></img>
    </div>


);

export default Logo;