import React, { useState } from 'react'
import './styles/TripleToggleSwitch.css'

export default function TripleToggleSwitch(props) {
    const [switchPosition, setSwitchPosition] = useState("left");
    const [animation, setAnimation] = useState(null);

    function getSwitchAnimation(value) {
        let animation = null;
        if (value === "center") {
            props.change("DRIVING");
            if (switchPosition === "left") animation = "left-to-center";
            else if (switchPosition === "right") animation = "right-to-center";
        } else if (value === "right") {
            props.change("BICYCLING");
            if (switchPosition === "center") animation = "center-to-right";
            else if (switchPosition === "left") animation = "left-to-right";
        } else if (value === "left") {
            props.change("WALKING");
            if (switchPosition === "center") animation = "center-to-left";
            else if (switchPosition === "right") animation = "right-to-left";
        }
        setAnimation(animation);
        setSwitchPosition(value);
    };

    return (
    <div className="triple-toggle-switch">
        <div
            className={`switch ${animation} ${switchPosition}-position`}
        ></div>
        <input
            defaultChecked
            onChange={(e) => getSwitchAnimation(e.target.value)}
            name="map-switch"
            id="left"
            type="radio"
            value="left"
        />
        <label
            className={`left-label ${
            switchPosition === "left" && "black-font"
            }`}
            htmlFor="left"
        >
            <h4>{props.option1}</h4>
        </label>

        <input
            onChange={(e) => getSwitchAnimation(e.target.value)}
            name="map-switch"
            id="center"
            type="radio"
            value="center"
        />
        <label
            className={`center-label ${
            switchPosition === "center" && "black-font"
            }`}
            htmlFor="center"
        >
            <h4>{props.option2}</h4>
        </label>

        <input
            onChange={(e) => getSwitchAnimation(e.target.value)}
            name="map-switch"
            id="right"
            type="radio"
            value="right"
        />
        <label
            className={`right-label ${
            switchPosition === "right" && "black-font"
            }`}
            htmlFor="right"
        >
            <h4>{props.option3}</h4>
        </label>
    </div>
    )
}
