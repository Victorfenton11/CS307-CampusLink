import React, { useEffect, useState } from 'react'
import './styles/Map.css'
import SearchBar from '../components/SearchBar'
import { GoogleMap, Marker, useLoadScript, DirectionsRenderer } from "@react-google-maps/api"
import { useMemo } from 'react'
import ClassLocation from '../components/ClassLocation'

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

  async function displayClassLocation(building_name, floor, room) {
    setDirectionsResponse(null);
    document.getElementById('map').style.height = "58vh";

    if (!building_name) {
      setClassLocation(['', floor, parseInt(room).toString()]);
      return;
    } else {
      setClassLocation([building_name, floor, parseInt(room).toString()]);
      const directionsService = new google.maps.DirectionsService();
      const results = await directionsService.route({
        origin: userLocation,
        destination: building_name,
        travelMode: google.maps.TravelMode.WALKING
      });
      setDirectionsResponse(results);
    }
  }

  async function displayLocation(destination) {
    setClassLocation(false);
    setDirectionsResponse(null);
    document.getElementById('map').style.height = "70vh";

    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: userLocation,
      destination: destination,
      travelMode: google.maps.TravelMode.WALKING
    });
    setDirectionsResponse(results);

    return;
  }

  return (
    <>
      <SearchBar placeholder="Lookup a Campus Location..." displayClass={displayClassLocation} displayLocation={displayLocation}/>
      <div className='location-container'>
        {classLocation && <ClassLocation className='class-location' building={classLocation[0]} floor={classLocation[1]} room={classLocation[2]}/>}
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