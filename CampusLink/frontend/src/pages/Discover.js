import React, { useState, useEffect } from 'react';
import './styles/Profile.css'
import './styles/Discovery.css'
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

  useEffect(() => {
    fetch('/api/rec/1/refresh/' + refresh)
      .then(response => response.json())
      .then(data => {
        setRecUsers(data.users);
        setRecCircles(data.circles);
      })
      .catch(error => console.error('Error fetching data: ', error));
  }, [refresh]);

  return (
    <div className='rec-style'>
      <h1>Users that share similar interests with you</h1>
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
      <h1>Circles for you</h1>
      {recCircles.map(item => (
        <div key={item.id} className='user-style'
        onMouseEnter={() => handleMouseEnter(item.id)}
        onMouseLeave={handleMouseLeave}>
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
      ))}
    <button onClick={handleRefreshClick}>Refresh</button>
    </div>
  );
}

export default Discover;