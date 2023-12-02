import React, { useState, useEffect } from 'react';
import './styles/Profile.css'
import './styles/Discovery.css'
import ClickableProfile from '../components/ClickableProfile';
import swal from 'sweetalert'

function Discover() {
  const [recUsers, setRecUsers] = useState([]);
  const [recCircles, setRecCircles] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [hoveredUserId, setHoveredUserId] = useState(null);

  const handleMouseEnter = (userId) => {
    setHoveredUserId(userId);
  };

  const handleMouseLeave = () => {
    setHoveredUserId(null);
  };

  const handleRefreshClick = () => {
    setRefresh(refresh + 1);
    if (refresh >= 1) {
        swal({
            title: "Be careful!",
            text: "You might start seeing users you have seen before or that don't share similarities with you!",
            icon: "warning",
            button: "OK",
          });
    }
  }

  const getRecommendations = async () => {
    fetch(`/api/rec/${sessionStorage.getItem('userID')}/refresh/` + refresh)
      .then(response => response.json())
      .then(data => {
        setRecUsers(data.users);
        setRecCircles(data.circles);
      })
      .catch(error => console.error('Error fetching data: ', error));
  }

  useEffect(() => {
    getRecommendations();
  }, [refresh]);

  return (
    <div className='rec-style'>
      <div className='discover-header'>
        <h1>Discover</h1>
      </div>
      <div className='recc-users-header'>
        <h1>Reccomended Users</h1>
      </div>
      <div className='recc-users'>
      {recUsers.map(item => (
        <div key={item.UserID} className='user-style'
        onMouseEnter={() => handleMouseEnter(item.UserID)}
        onMouseLeave={handleMouseLeave}>
            <label className="custom-file-upload fas">
                <div className="img-wrap" >
                    <img htmlFor="photo-upload" src={'../../../static/images/' + item.PhotoFileName}/>
                </div>
            </label>
          <div className={`user-details ${item.UserID === hoveredUserId ? 'user-details-visible' : 'user-details-hidden'}`}>
            <p>Name: {item.Name}</p>
            <p>Username: {item.UserName}</p>
            <p>Interest: {item.Interest}</p>
          </div>
        </div>
      ))}
      </div>
      <div className='recc-users-header'>
        <h1>Reccomended Circles</h1>
      </div>
      <div className='recc-users'>
      {recCircles.map( 
        (item) => {
        const handleClickCircle = async () => {
          try{
            const userID = sessionStorage.getItem('userID');
            const fetchString = 'api/joincircle' + `?id=${userID}` + '&id=' + item.id;
            const response = await fetch(fetchString);
          if (!response.ok) {
            swal("Error", "Unexpected error while joining Circle. Please try again later.", "error");
            return;
          }
       
          swal("Joined!", `Successfully joined Circle ${item.Name}`, "success");

          getRecommendations();

          return;
          } catch (error) {
            swal("Error", "Unexpected error while joining Circle 2. Please try again later.", "error");
            return;
          }
        }

        return(
          <div key={item.id} className='user-style'
          onMouseEnter={() => handleMouseEnter(item.id)}
          onMouseLeave={handleMouseLeave} onClick={handleClickCircle}>
              <label className="custom-file-upload fas">
                  <div className="img-wrap" >
                  </div>
              </label>
              <div className={`user-details ${item.id === hoveredUserId ? 'user-details-visible' : 'user-details-hidden'}`}>
            <p>Name: {item.Name}</p>
            <p>Description: {item.Description}</p>
            <p>Owner: {item.owner.UserName}</p>
            </div>
          </div>
        )})}
      </div>
      <button onClick={handleRefreshClick}>Refresh</button>
    </div>
  );
}

export default Discover;