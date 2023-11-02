import React, { useState, useEffect } from 'react';
import './styles/Profile.css'
import './styles/Discovery.css'

function Recommendation() {
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(0);


  const handleRefreshClick = () => {
    setRefresh(refresh + 1);
  }

  useEffect(() => {
    fetch('/api/rec/1/refresh/' + refresh)
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data: ', error));
  }, [refresh]);

  return (
    <div className='discovery-style'>
      <h1>Users that share similar interests with you</h1>
      {data.map(item => (
        <div key={item.UserID} className='user-style'>
            <label className="custom-file-upload fas">
                <div className="img-wrap" >
                    <img htmlFor="photo-upload" src={'../../../static/images/' + item.PhotoFileName}/>
                </div>
            </label>
            <div className="user-details">
          <p>Name: {item.Name}</p>
          <p>Interest: {item.Interest}</p>
          </div>
        </div>
      ))}
    <button onClick={handleRefreshClick}>Refresh</button>
    </div>
  );
}

export default Recommendation;




