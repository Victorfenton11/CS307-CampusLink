import React from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from "@mui/material/Grid";

const PostCardItem = ({post}) => {

  // delete comment
  const deletePost = async () => {
    try {
      const response = await fetch('/api/posts/deleteOne/', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Post-ID': post.id
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete posts');
      }
      // Refresh the posts in your state
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };
    
  return (
    <div>
      <Card sx={{ minWidth: 300, marginTop: 3}} elevation={2}>
        <CardContent>
            <Typography  component="div"></Typography>
              <Grid container justifyContent="space-between">

                <Typography style={{whiteSpace: 'pre-line' }} sx={{ m: 1, p: 1 }} variant="body1" >
                  {post?.content}
                </Typography>

                <button onClick={deletePost}>Delete Comment</button> 

              </Grid>

                <Typography sx={{ m: 1, p: 1 }} color="text.secondary">
                {/*<Link to={`/profile/${post?.creator_id}`} style={{  color: "grey"}}>
                  {post?.creator}
                </Link> 
                */}
                {post?.anonymous && 'Anonymous' ? 'Posted By Anonymous' : `UserID: ${post?.creator_id}`}
                  , posted on {post?.created}
              </Typography>
        </CardContent>  
          
      </Card>
    </div>
    

  )
}

export default PostCardItem