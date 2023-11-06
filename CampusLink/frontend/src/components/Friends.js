import React, { useState, useEffect } from 'react'
import swal from 'sweetalert';
import './styles/Friends.css'

export default function Friends() {

  const [userData, setUserData] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [isAddMode, setIsAddMode] = useState(false)
  const [isIncomingMode, setIsIncomingMode] = useState(false);

  const handleAddClick = () => {
    setIsAddMode(!isAddMode);
  };

  const handleIncomingRequestsClick = () => {
    setIsIncomingMode(!isIncomingMode);
    if (!isIncomingMode) {
      fetchIncomingRequests();
   }
  };
 
  const addFriend = async () => {
     // Perform logic to save the modified data to the API
    try{
      var friendid = document.getElementById("inputBox").value;
      // console.log(friendid)
      const userID = sessionStorage.getItem('userID');
      const fetchString = 'api/addfriend' + '?id=' + userID + '&id=' + friendid; 
      // console.log(fetchString)
      const response = await fetch(fetchString);
    if (!response.ok) {
      throw new Error('User Not Found');
    }

    // Notify the user that the data was saved successfully
    swal("Done!", "Friend request sent.", "success");
    
    // Exit edit mode
    setIsAddMode(false);
    fetchIncomingRequests();
    } catch (error) {
      console.error('Error saving user data:', error.message);
      swal("Oops!", "User not found. Please try again.", "error");
    }
    fetchFriendData();
  };

  const fetchFriendData = async (userID) => {
    try {
      const userID = sessionStorage.getItem('userID');
      const response = await fetch(`/api/viewfriends/${userID}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
  
      const data = await response.json();
      const DisplayData=data.friends.map(
        (user)=>{
          const removeFriend = async (userID) => {
            // Perform logic to save the modified data to the API
           try{
             const userID = sessionStorage.getItem('userID');
             const fetchString = 'api/removefriend' + `?id=${userID}` + '&id=' + user.UserName; 
             const response = await fetch(fetchString);
           if (!response.ok) {
             throw new Error('User Not Found');
           }
        
           // Notify the user that the data was saved successfully
          //  alert('User ' + user.UserName + ' successfully removed');
          //  problem here
           swal("Removed!", `User ${user.UserName} successfully removed.`, "success");
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
              <button className="slide-button" role="button" onClick={removeFriend}><span class="text">Remove Friend</span><span>are you sure?</span></button>
             
            </tr>
          )
         
        }
      )
      setUserData(DisplayData);
    } catch (error) {
      console.error(error);
    }
    
  }

  const fetchIncomingRequests = async () => {
    try {
        const userID = sessionStorage.getItem('userID');
        const response = await fetch(`/api/incoming-requests/${userID}`); // Adjust the API endpoint as necessary
        if (!response.ok) {
            throw new Error('Failed to fetch incoming friend requests');
        }
        const data = await response.json();
        setIncomingRequests(data);
    } catch (error) {
        console.error(error);
    }
  };

  const acceptRequest = async (userName) => {
    try {
        const encodedUserName = encodeURIComponent(userName);
        const userID = sessionStorage.getItem('userID');
        const response = await fetch(`/api/accept-friend-request/${userID}/${encodedUserName}`, {
        method: 'POST',
        });

        if (response.ok) {
            const data = await response.json();
            swal("Accepted!", data.message, "success");
            fetchFriendData();
            fetchIncomingRequests();
        } else {
            const errorData = await response.json();
            swal("Error", errorData.error, "error");
        }
    } catch (error) {
        console.error("There was an error accepting the friend request:", error);
    }
  };

  const declineRequest = async (userName) => {
    try {
        const encodedUserName = encodeURIComponent(userName);
        const userID = sessionStorage.getItem('userID');
        const response = await fetch(`/api/decline-friend-request/${userID}/${encodedUserName}`, {
            method: 'POST',
        });

        if (response.ok) {
            const data = await response.json();
            swal("Rejected!", data.message, "success");
            // Update your component's state if necessary
            fetchIncomingRequests(); // Re-fetch the incoming requests
        } else {
            const errorData = await response.json();
            swal("Error", errorData.error, "error");
        }
    } catch (error) {
        console.error("There was an error declining the friend request:", error);
    }
  };



  useEffect(() => {
    fetchFriendData();
  }, []);

  useEffect(() => {
    if (isIncomingMode) {
       fetchIncomingRequests();
    }
 }, [isIncomingMode]);


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
    // console.log(incomingRequests);
    return (
      <div className="circles-style">
        <div className="overlay">
          <div className="overlay-content-wrapper">
            <table className="table table-striped">
              <thead>
                <th>From</th>
                <th>Date</th>
                <th>Action</th>
              </thead>
              <tbody>
              {incomingRequests.map((request) => (
                <tr key={request.request_id}>
                  <td>{request.from_user.UserName}</td> {/* Update field names based on your API response */}
                  <td>{request.timestamp}</td>
                  <td>
                    <button className="button" onClick={() => acceptRequest(request.from_user.UserName)}>Accept</button>
                    <button className="button" onClick={() => declineRequest(request.from_user.UserName)}>Decline</button>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
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