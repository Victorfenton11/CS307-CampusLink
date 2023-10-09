import React from 'react'
import './styles/Map.css'
import SearchBar from '../components/SearchBar'
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api"
import { useMemo } from 'react'
import ClassLocation from '../components/ClassLocation'

export default function Map() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyBDreTza0OGgqM7bw6YChDq7S49Tm8OsjU",
  });
  const center = useMemo(() => ({ lat: 40.4278135, lng: -86.9153688}), []);

  return (
    <>
      <SearchBar />
      <div className='container'>
        <ClassLocation className='class-location'/>
        {!isLoaded ? (
          <h1>Loading...</h1>
        ) : (
          <GoogleMap mapContainerClassName='map-container' center={center} zoom={13} />
        )}
      </div>
    </>
  )
}