import React, { useState, useEffect } from 'react'
import swal from 'sweetalert';
import './styles/Friends.css';
import Switch from "react-switch";

export default function Groups() {

  const [circleData, setCircleData] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [isIncomingMode, setIsIncomingMode] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [checked, setChecked] = useState(false);

  const handleCreateClick = () => {
    setIsCreateMode(!isCreateMode);

    setUsersList([]);
  };

  const handleIncomingRequestsClick = () => {
    setIsIncomingMode(!isIncomingMode);
    if (!isIncomingMode) {
      fetchInvitations();
   }
  };

  const createCircle = async () => {
    try {
      var name = document.getElementById("newCircleName").value;
      var description = document.getElementById("newCircleDescription").value;

      if (name === "") {
        swal("Error", "Name cannot be empty", "error");
        return;
      }

      const data = new FormData();
      data.append('Name', name);
      data.append('Description', description);
      data.append('users', usersList);
      data.append('ownerID', sessionStorage.getItem('userID'));
      console.log(checked);
      data.append('public', checked);
      const response = await fetch('/api/circle/create/', {
        method: 'POST',
        body: data
      });
      if (!response.ok) {
        swal("Error!", "Could not create Circle", "error");
        return;
      }

      swal("Success!", "New Circle successfully created", "success");
      setIsCreateMode(false);

    } catch (e) {
      swal("Error", "", "error");
      return;
    }

    fetchCircleData();
  };
 
  const addToCircle = async () => {
    try{
      var username = document.getElementById("userToAdd").value;
      const response = await fetch(`/api/users/${username}`);
      if (!response.ok) {
        swal("Error!", "Username not found", "error");
        return;
      }
    } catch (error) {
      swal("Error!", "Username not found", "error");
      return;
    }

    setUsersList(usersList.concat([username]));
    document.getElementById("userToAdd").value = "";
  };

  const fetchCircleData = async (userID) => {
    try {
      const userID = sessionStorage.getItem('userID');
      const response = await fetch(`/api/viewcircles/${userID}`);
      if (!response.ok) {
        swal("Error!", "Failed to fetch user circle data", "error");
        return;
      }
  
      const data = await response.json();
      const DisplayData=data.map(
        (circle)=>{
          const deleteCircle = async (userID) => {
            try{
              const userID = sessionStorage.getItem('userID');
              const fetchString = 'api/deletecircle' + `?id=${userID}` + '&id=' + circle.id;
              const response = await fetch(fetchString);
              if (!response.ok) {
                swal("Error!", "Could not delete the Circle", "error");
              }
            
              swal("Deleted!", `Circle ${circle.Name} successfully deleted.`, "success");
              // Exit edit mode
              setIsCreateMode(false);
            } catch (error) {
              console.error('Error saving user data:', error.message);
            }
            fetchCircleData();
          };
          
          const createGroupChat = async () => {
            try{
              axios.get(`https://api.groupme.com/v3`)
              .then(response => {
                //TODO
              })
              .catch(error => {
                console.log(error);
              });

              if (!circle.groupChatCreated) {
                const fetchString = 'api/creategroupchat' + `?id=${circle.id}`;
                const response = await fetch(fetchString);
                if (!response.ok) {
                  swal("Error!", "Could not create group chat for this Circle", "error");
                  return;
                }
                swal("Created!", `Group Chat for Circle ${circle.Name} successfully created via GroupMe.`, "success");
                circle.groupChatCreated = true;
              } else {
                const fetchString = 'api/updategroupchat' + `?id=${circle.id}`;
                const response = await fetch(fetchString);
                if (!response.ok) {
                  swal("Error!", "Could not update group chat for this Circle", "error");
                  return;
                }

                swal("Updated!", `Group Chat for Circle ${circle.Name} successfully updated.`, "success");
              }
            } catch (error) {
              console.error('Error saving user data:', error.message);
              return;
            }
            fetchCircleData();

          }

          return(
            <tr key={circle.id}>
              <td key="{circle.Name}">{circle.Name}</td>
              <td>{circle.Description}</td>
              <button className="slide-button" role="button" onClick={() => createGroupChat}><span class="text">{circle.groupChatCreated ? "Update" : "Create"} Group Chat</span><span>Create Group Chat</span></button>
              {circle.owner.UserID == userID && <button className="slide-button" role="button" onClick={deleteCircle}><span class="text">Delete Circle</span><span>are you sure?</span></button>}
            </tr>
          )
        }
      )
      setCircleData(DisplayData);
    } catch (error) {
      console.error(error);
    }
    
  }

  const fetchInvitations = async () => {
    //TODO
    return;
  };

  const acceptRequest = async (userName) => {
    return;
  };

  const declineRequest = async (userName) => {
    return;
  };

  useEffect(() => {
    fetchCircleData();
  }, []);

  useEffect(() => {
    if (isIncomingMode) {
       fetchInvitations();
    }
 }, [isIncomingMode]);

 const handleChange = (checked) => {
  setChecked(checked);
 }


  if (isCreateMode) {
    return (
      <div className="circles-style">
        <div className="overlay">
          <div className="overlay-content-wrapper">
            <input id="newCircleName" className="inputBox" type="text" placeholder='New Circle Name'></input>
            <input id="newCircleDescription" className="inputBox description" type="text" placeholder='Description'></input>
            <label className='add-users'>Add Users:</label>
            <input id="userToAdd" className="inputBox" type="text" placeholder='username'></input>
            <button className="button addButton" onClick={addToCircle}>Add to Circle</button>
            <label className='add-users'>{usersList.join()}</label>
            <label className='add-users'>Private<Switch onChange={handleChange} checked={checked} uncheckedIcon={false} checkedIcon={false}/>Public</label>
            <button className="button createButton" onClick={createCircle}>Create Circle</button>
            <button className="button" onClick={handleCreateClick}>Cancel</button>
          </div>
        </div>
        <div className="content-wrapper">
            <div className="button-container">
              <button className="button" onClick={handleCreateClick}>Create Circle</button>
              <button className="button" onClick={handleIncomingRequestsClick}>Invitations</button>
            </div>
            <div className="List-Wrapper" >
              <table className="table table-striped">
                <thead>
                  <th>Name</th>
                  <th>Description</th>
                  <th></th>
                </thead>
                <tbody className="table-body">{circleData}</tbody>
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
                <th>Circle</th>
                <th>Date</th>
                <th>Action</th>
              </thead>
              <tbody>
              {invitations.map((invitation) => (
                <tr key={invitation.request_id}>
                  <td>{invitation.from_user.CircleName}</td> {/* Update field names based on your API response */}
                  <td>{invitation.timestamp}</td>
                  <td>
                    <button className="button" onClick={() => acceptRequest(invitation.from_user.CircleName)}>Join</button>
                    <button className="button" onClick={() => declineRequest(invitation.from_user.CircleName)}>Decline</button>
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
              <button className="button" onClick={handleCreateClick}>Create Circle</button>
              <button className="button" onClick={handleIncomingRequestsClick}>Invitations</button>
            </div>
            <div className="List-Wrapper" >
              <table className="table table-striped">
                <thead>
                  <th>Name</th>
                  <th>Description</th>
                  <th></th>
                </thead>
                <tbody className="table-body">{circleData}</tbody>
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
              <button className="button" onClick={handleCreateClick}>Create Circle</button>
              <button className="button" onClick={handleIncomingRequestsClick}>Invitations</button>
            </div>
            <div className="List-Wrapper" >
              <table className="table table-striped">
                <thead>
                  <th>Name</th>
                  <th>Description</th>
                  <th></th>
                </thead>
                <tbody className="table-body">{circleData}</tbody>
              </table>
            </div>
        </div>        
    </div>
  )
}