import React from 'react'
import { Link } from 'react-router-dom'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Moment from 'react-moment';
import { useState, useEffect } from "react";

const ThreadListItem = ({thread}, {index}) => {
  const [userName, setUserName] = useState(null);
  const fetchUserData = async () => {
    try {
      let url = "/api/user/" + thread.creator_id;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      // Parse JSON response
      const data = await response.json();

      setUserName(data.UserName);
    } catch (error) {
      console.log(error.message);
    }
  };

  // UseEffect hook to fetch data when the component mounts
  useEffect(() => {
    fetchUserData();
  }, []);
  
  return (
    <div className="thread-list-item">
      <List sx={{ width: '100%', bgcolor: 'blueviolet' }}>
        <ListItem alignItems="flex-start" key={{index}} className="thread-list">
          {/* This Link needs some fixing. */}
          <Link to = {`/threads/${thread.id}`} style={{ textDecoration: 'none', color: 'white' }}>  
            <ListItemText 
              primary={thread?.subject} 
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ color: 'white', display: 'inline' }}
                    component="span"
                    variant="body2"
                    color="text.secondary"
                  > {thread?.anonymous ? 'Posted by Anonymous' : `Posted by: ${userName}`}

                  </Typography>
                  <span style={{ color: 'lavender' }}> 
                    , updated <Moment fromNow>{thread?.updated}</Moment>
                  </span>
                </React.Fragment>
              }
            />       
          </Link>
        </ListItem>
      <Divider component="li" sx={{marginLeft: '2%', marginRight: '2%'}}/>
      </List>
    </div>
   
    
  )
}

export default ThreadListItem