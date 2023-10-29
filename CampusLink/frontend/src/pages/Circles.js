import React, { useState, useEffect } from 'react'
import './styles/Circles.css'

export default function Circles() {

  const [userData, setUserData] = useState([]);
  const [isAddMode, setIsAddMode] = useState(false)
  const [isIncomingMode, setIsIncomingMode] = useState(false);

  const handleAddClick = () => {
    setIsAddMode(!isAddMode);
  };

  const handleIncomingRequestsClick = () => {
    setIsIncomingMode(!isIncomingMode);
  };

  const addFriend = async (userID) => {
     // Perform logic to save the modified data to the API
    try{
      var friendid = document.getElementById("inputBox").value;
      const fetchString = 'api/addfriend' + '?id=1' + '&id=' + friendid; 
      const response = await fetch(fetchString);
    if (!response.ok) {
      throw new Error('User Not Found');
    }

    // Notify the user that the data was saved successfully
    alert('Friend request sent');

    // Exit edit mode
    setIsAddMode(false);
    } catch (error) {
      console.error('Error saving user data:', error.message);
      alert('User not found');
    }
    fetchFriendData();
  };

  const removeFriend = async (userID) => {
    // Perform logic to save the modified data to the API
   try{
     var friendid = document.getElementById("inputBox").value;
     const fetchString = 'api/removefriend' + '?id=1' + '&id=' + friendid; 
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
          const removeFriend = async (userID) => {
            // Perform logic to save the modified data to the API
           try{
             const fetchString = 'api/removefriend' + '?id=1' + '&id=' + user.UserName; 
             const response = await fetch(fetchString);
           if (!response.ok) {
             throw new Error('User Not Found');
           }
        
           // Notify the user that the data was saved successfully
           alert('User ' + user.UserName + ' successfully removed');
        
           // Exit edit mode
           setIsAddMode(false);
           } catch (error) {
             console.error('Error saving user data:', error.message);
           }
           fetchFriendData();
          };
          return(
            <tr>
              <td key="{user.UserName}">{user.UserName}</td>
              <td>{user.Name}</td>
              <td>{user.UserEmail}</td>
              <button class="slide-button" role="button" onClick={removeFriend}><span class="text">Remove Friend</span><span>are you sure?</span></button>
             
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
      <div className="circles-style">
        <div className="overlay">
          <div className="overlay-content-wrapper">
            <input id="inputBox" className="inputBox" type="text"></input>
            <button className="button addButton" onClick={addFriend}>Add Friend</button>
            <button className="button" onClick={handleAddClick}>Cancel</button>
          </div>
        </div>
          <div className="content-wrapper">
              <div className="button-container">
                <button className="button" onClick={handleAddClick}>Add Friend</button>
              </div>
              <div className="List-Wrapper" >
                <table className="table table-striped">
                  <thead>
                    <th>Username</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th></th>
                  </thead>
                  <tbody className="table-body">{userData}</tbody>
                </table>
              </div>
          </div>        
      </div>
    )
  }

  if (isIncomingMode) {
    return (
      <div className="circles-style">
        <div className="overlay">
          <div className="overlay-content-wrapper">
            <h2>Incoming Friend Requests</h2>
            {/* Add your dummy content for incoming requests here */}
            <p>Request from JohnDoe</p>
            <p>Request from JaneSmith</p>
            {/* Add more dummy content if needed */}
            <button className="button" onClick={handleIncomingRequestsClick}>Back</button>
          </div>
        </div>
        <div className="content-wrapper">
            <div className="button-container">
              <button className="button" onClick={handleAddClick}>Add Friend</button>
              <button className="button" onClick={handleIncomingRequestsClick}>Incoming Requests </button>
            </div>
            <div className="List-Wrapper" >
              <table className="table table-striped">
                <thead>
                  <th>Username</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th></th>
                </thead>
                <tbody className="table-body">{userData}</tbody>
              </table>
            </div>
        </div>        
      </div>
    );
  }

  return (
    <div className="circles-style">
        <div className="content-wrapper">
            <div className="button-container">
              <button className="button" onClick={handleAddClick}>Add Friend</button>
              <button className="button" onClick={handleIncomingRequestsClick}>Incoming Requests </button>
            </div>
            <div className="List-Wrapper" >
              <table className="table table-striped">
                <thead>
                  <th>Username</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th></th>
                </thead>
                <tbody className="table-body">{userData}</tbody>
              </table>
            </div>
        </div>        
    </div>
  )
}

