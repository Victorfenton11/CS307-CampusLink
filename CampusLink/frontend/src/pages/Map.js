import React, { useEffect, useState } from 'react'
import './styles/Map.css'
import SearchBar from '../components/SearchBar'
import TripleToggleSwitch from '../components/TripleToggleSwitch'
import { GoogleMap, Marker, useLoadScript, DirectionsRenderer } from "@react-google-maps/api"
import { useMemo } from 'react'
import ClassLocation from '../components/ClassLocation'
import EstTime from '../components/EstTime'
import swal from 'sweetalert'

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

  useEffect(() => {
    if (!classLocation) return;
    if (classLocation[0]) displayClassLocation(classLocation[1], classLocation[2], classLocation[3]);
    else displayLocation(classLocation[1]);
  }, [travelMethod]);

  const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setUserLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    }, () => setUserLocation("Purdue University"));
  }

  function searchLocation(query) {
    fetch('/api/get-class-location' + '?location=' + query).then((response) => 
      response.json()
    ).then((data) => {
      if (JSON.stringify(data) === '{}') {
        displayLocation(query);
      } else {
        displayClassLocation(data.building_name, data.floor, data.room);
      }
    });
    return;
  }

  function changeTravelMethod(selection) {
    console.log(classLocation);
    console.log(travelMethod);
    if (!classLocation) return;

    if (selection !== travelMethod) {
      setTravelMethod(selection);
    }
    return;
  }

  async function displayClassLocation(building_name, floor, room) {
    if ((floor) && (room.toString().length > 4 || room.toString().length < 3)) {
      swal("Error", "The entered Class Location or Room number is invalid.", "error");
      return;
    }

    setDirectionsResponse(null);
    document.getElementById('map').style.height = "52vh";

    if (!floor) {
      setClassLocation([true, building_name, '', ''])
    } else {
      setClassLocation([true, building_name, floor, room.toString()]);
    }

    try {
      const directionsService = new google.maps.DirectionsService();
      getUserLocation();
      console.log(travelMethod);
      const results = await directionsService.route({
        origin: userLocation,
        destination: building_name + "Purdue University",
        travelMode: google.maps.TravelMode[travelMethod]
      });
      setDirectionsResponse(results);
      setEstTime(results.routes[0].legs[0].duration.text);
    } catch (e) {
      swal("Error", "Could not find directions to the entered destination.", "error");
      setEstTime(null);
    }
    return;
  }

  async function displayLocation(destination) {
    setClassLocation([false, destination]);
    setDirectionsResponse(null);
    document.getElementById('map').style.height = "62vh";

    try {
      const directionsService = new google.maps.DirectionsService();
      getUserLocation();
      console.log(travelMethod);
      const results = await directionsService.route({
        origin: userLocation,
        destination: destination,
        travelMode: google.maps.TravelMode[travelMethod]
      });
      setDirectionsResponse(results);
      setEstTime(results.routes[0].legs[0].duration.text);
    } catch (e) {
      swal("Error", "Could not find directions to the entered destination.", "error");
      setEstTime(null);
    }
    return;
  }

  return (
    <>
      <SearchBar placeholder="Lookup a Campus Location..." handleSearch={searchLocation}/>
      <div className='location-container'>
        {classLocation && classLocation[0] && <ClassLocation className='class-location' building={classLocation[1]} floor={classLocation[2]} room={classLocation[3]}/>}
        {classLocation && 
          <div className='travel-options'>
            <TripleToggleSwitch change={changeTravelMethod} text1="Walk" text2="Drive" text3="Cycle" value1="WALKING" value2="DRIVING" value3="BICYCLING" className='travel-method-btn'/>
            <EstTime estTime={estTime}></EstTime>
          </div>}
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