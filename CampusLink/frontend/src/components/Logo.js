import React from "react";
import small_logo from "../../static/logo_small.png"

const Logo = ({style}) => (
    
    <div className="logoWrapper"> 
         <img className="logo" src={small_logo}
         style={style}></img>
    </div>


);

export default Logo;