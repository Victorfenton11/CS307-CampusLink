import React from 'react'
import { Link } from 'react-router-dom'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Moment from 'react-moment';


const ThreadListItem = ({thread}, {index}) => {
  
  return (
    <div className="thread-list-item">
      <List sx={{ width: '100%', bgcolor: '#1A2027' }}>
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
                  > {thread?.anonymous && 'Anonymous' ? 'Posted By Anonymous' : `Posted by UserID: ${thread?.creator_id}`}
                    {/* Created by UserID: {thread?.creator_id} */}
                    {/* Instead of Created by creator_id, I want to show the name based on the UserID, which is the creator_id */}
                    

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