import React, { useEffect, useState } from 'react'
import './styles/Map.css'
import SearchBar from '../components/SearchBar'
import TripleToggleSwitch from '../components/TripleToggleSwitch'
import { GoogleMap, Marker, useLoadScript, DirectionsRenderer } from "@react-google-maps/api"
import { useMemo } from 'react'
import ClassLocation from '../components/ClassLocation'
import EstTime from '../components/EstTime'

const libraries = ['places'];

export default function Map() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyBDreTza0OGgqM7bw6YChDq7S49Tm8OsjU",
    libraries: libraries,
  });
  const center = useMemo(() => ({ lat: 40.4278135, lng: -86.9153688}), []);

  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [classLocation, setClassLocation] = useState(null);
  const [userLocation, setUserLocation] = useState({});
  const [travelMethod, setTravelMethod] = useState("WALKING");
  const [estTime, setEstTime] = useState(null);

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setUserLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    }, () => setUserLocation("Purdue University"));
  }

  function changeTravelMethod(selection) {
    if (!classLocation) return;

    if (selection !== travelMethod) {
      setTravelMethod(selection);
      if (classLocation[0]) displayClassLocation(classLocation[1], classLocation[2], classLocation[3]);
      else displayLocation(classLocation[1]);
    }
    return;
  }

  async function displayClassLocation(building_name, floor, room) {
    if ((floor) && (room.toString().length > 4 || room.toString().length < 3)) {
      alert("The entered Class Location or Room number is invalid.");
      return;
    }

    setDirectionsResponse(null);
    document.getElementById('map').style.height = "54vh";

    if (!building_name) {
      setClassLocation([true, '', floor, room.toString()]);
      return;
    } else if (!floor) {
      setClassLocation([true, building_name.slice(0, -18), '', ''])
    } else {
      setClassLocation([true, building_name.slice(0, -18), floor, room.toString()]);
    }

    const directionsService = new google.maps.DirectionsService();
    getUserLocation();
    console.log(travelMethod);
    const results = await directionsService.route({
      origin: userLocation,
      destination: building_name,
      travelMode: google.maps.TravelMode[travelMethod]
    });
    setDirectionsResponse(results);
  }

  async function displayLocation(destination) {
    setClassLocation([false, destination]);
    setDirectionsResponse(null);
    document.getElementById('map').style.height = "64vh";

    const directionsService = new google.maps.DirectionsService();
    getUserLocation();
    console.log(travelMethod);
    const results = await directionsService.route({
      origin: userLocation,
      destination: destination,
      travelMode: google.maps.TravelMode[travelMethod]
    });
    setDirectionsResponse(results);

    return;
  }

  return (
    <>
      <SearchBar placeholder="Lookup a Campus Location..." displayClass={displayClassLocation} displayLocation={displayLocation}/>
      <div className='location-container'>
        {classLocation && classLocation[0] && <ClassLocation className='class-location' building={classLocation[1]} floor={classLocation[2]} room={classLocation[3]}/>}
        {classLocation && <div className='travel-options'><TripleToggleSwitch change={changeTravelMethod} option1="Walk" option2="Drive" option3="Cycle" className='travel-method-btn'/><EstTime estTime={estTime}></EstTime></div>}
        {!isLoaded ? (
          <h1>Loading...</h1>
        ) : (
          <>
            <GoogleMap id='map' mapContainerClassName='map-container' center={center} zoom={13}>
              {directionsResponse && <DirectionsRenderer directions={directionsResponse}/>}
            </GoogleMap>
          </>
        )}
      </div>
    </>
  )
}