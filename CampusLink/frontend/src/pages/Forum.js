import React from 'react'
import { useLocation } from 'react-router-dom';

export default function Forum() {
  const userID = sessionStorage.getItem('userID');
  console.log('UserID from sessionStorage:', userID);
  
  return (
    <div>Forum</div>
  )
}
