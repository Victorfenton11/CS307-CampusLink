import React, { useState, useEffect } from 'react'
import './styles/FriendPage.css'
import Footer from "../components/Footer"
import DataTable from "../components/DataTable"
import MockData from "../components/MOCK_DATA.json"
import Navbar from "../components/Navbar"

export default function FriendPage() {

  const [userData, setUserData] = useState([]);
  const [isAddMode, setIsAddMode] = useState(false)

  const handleAddClick = () => {
    setIsAddMode(!isAddMode);
  };

  const addFriend = async (userID) => {
     // Perform logic to save the modified data to the API
    try{
      var friendid = document.getElementById("inputBox").value;
      const fetchString = 'api/addfriend' + '?id=1' + '?friendID=' + friendid; 
      const response = await fetch(fetchString);
    if (!response.ok) {
      throw new Error('User Not Found');
    }

    // Notify the user that the data was saved successfully
    alert('Successfully changed the profile');

    // Exit edit mode
    setIsAddMode(false);
    } catch (error) {
      console.error('Error saving user data:', error.message);
    }
  };

  const fetchFriendData = async (userID) => {
    try {
      const response = await fetch('/api/viewfriends/1');
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
  
      const data = await response.json();
      const DisplayData=data.friends.map(
        (user)=>{
          return(
            <tr>
              <td key="{user.UserName}">{user.UserName}</td>
              <td>{user.Name}</td>
              <td>{user.userEmail}</td>
            </tr>
          )
        }
      )
      setUserData(DisplayData);
    } catch (error) {
      console.error(error);
    }
    
  }

  useEffect(() => {
    fetchFriendData();
  }, []);

  //<DataTable userdata={userData}/>

  if (isAddMode) {
    return (
      <div className="page-wrapper">
        <div className="overlay">
          <div className="overlay-content-wrapper">
            <input id="inputBox" className="inputBox" type="text"></input>
            <button className="button addButton" onClick={addFriend}>Add Friend</button>
            <button className="button" onClick={handleAddClick}>Cancel</button>
          </div>
        </div>
          <Navbar></Navbar>
          <div className="content-wrapper">
              <div className="button-container">
                <button className="button" onClick={handleAddClick}>Add Friend</button>
                <button className="button">Remove Friend</button>
              </div>
              <div className="List-Wrapper" >
                <table className="table table-striped">
                  <thead>
                    <th>Username</th>
                    <th>Name</th>
                    <th>Email</th>
                  </thead>
                  <tbody className="table-body">{userData}</tbody>
                </table>
              </div>
          </div>        
      </div>
    )
  }

  return (
    <div className="page-wrapper">
        <Navbar></Navbar>
        <div className="content-wrapper">
            <div className="button-container">
              <button className="button" onClick={handleAddClick}>Add Friend</button>
              <button className="button">Remove Friend</button>
            </div>
            <div className="List-Wrapper" >
              <table className="table table-striped">
                <thead>
                  <th>Username</th>
                  <th>Name</th>
                  <th>Email</th>
                </thead>
                <tbody className="table-body">{userData}</tbody>
              </table>
            </div>
        </div>        
    </div>
  )


}
