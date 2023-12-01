import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { useState, useEffect } from "react";

const PostCardItem = ({ post }) => {
  const [userName, setUserName] = useState(null);

  // delete comment
  const deletePost = async () => {
    try {
      const response = await fetch("/api/posts/deleteOne/", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Post-ID": post.id,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete posts");
      }
      // Refresh the posts in your state
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUserName = async () => {
    try {
      let url = "/api/user/" + post.creator_id;
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

  useEffect(() => {
    fetchUserName();
  }, []);

  return (
    <div>
      <Card sx={{ minWidth: 300, marginTop: 3 }} elevation={2}>
        <CardContent>
          <Typography component="div"></Typography>
          <Grid container justifyContent="space-between">
            <Typography
              style={{ whiteSpace: "pre-line" }}
              sx={{ m: 1, p: 1 }}
              variant="body1"
            >
              {post?.content}
            </Typography>

            <button onClick={deletePost}>Delete Comment</button>
          </Grid>

          <Typography sx={{ m: 1, p: 1 }} color="text.secondary">
            {post?.anonymous ? "Posted by Anonymous" : `Posted by: ${userName}`}
            , posted on {post?.created}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostCardItem;
