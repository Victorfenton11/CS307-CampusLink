import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import InfiniteScroll from "react-infinite-scroll-component";
import Grid from "@mui/material/Grid";
{
  /*import AuthContext from '../context/AuthContext'*/
}
import { Link } from "react-router-dom";
import ShareIcon from "@mui/icons-material/Share";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ReplyForm from "../components/ReplyForm";
import PostCardItem from "../components/PostCardItem";

const Thread = () => {
  // get the user first
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // initalize thread and posts component state
  const [thread, setThread] = useState(null);
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  // Function to fetch user data from the API
  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/user/1");

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      // Parse JSON response
      const data = await response.json();

      setUserData(data);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  // UseEffect hook to fetch data when the component mounts
  useEffect(() => {
    fetchUserData();
  }, []);

  // extract thread id
  let params = useParams();
  let threadID = params.id;

  // trigger thread update
  useEffect(() => {
    let getThread = async () => {
      let response = await fetch(`/api/threads/${threadID}`);
      let data = await response.json();
      setThread(data);
    };

    getThread();
  }, [threadID]);

  // trigger posts update
  useEffect(() => {
    let getPosts = async () => {
      // fetch the posts from api endpoint
      let response = await fetch(`/api/threads/${threadID}/posts?page=${page}`);

      // parse the data in json
      let data = await response.json();

      // update the state of threads
      setPosts(data.results);

      // check if there is more posts
      if (data.next === null) {
        setHasMore(false);
      }
      setPage(page + 1);
    };
    getPosts();
  }, [threadID]);

  // fetch next posts
  const getMorePosts = async () => {
    try {
      // fetch the posts from api endpoint
      const response = await fetch(
        `/api/threads/${threadID}/posts?page=${page}`
      );

      // parse the data in json
      let data = await response.json();
      console.log("fetching");

      return data.results;
    } catch (err) {
      console.log("No next page.");
    }
  };

  const fetchData = async () => {
    // get more posts from next fetch
    let morePosts = await getMorePosts();

    // update the thread state by combining data
    setPosts([...posts, ...morePosts]);

    // check the fetch of last page, if yes, HasMore is false
    if (morePosts.length === 0 || morePosts.length < 10) {
      setHasMore(false);
    }
    setPage(page + 1);
  };

  // delete Posts
  const deleteAllPosts = async () => {
    try {
      const response = await fetch('/api/posts/delete/', { method: 'DELETE' });
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
    <div style={{ marginTop: 100 }}>
      <Container>
        <Card sx={{ minWidth: 300, marginTop: 3 }} elevation={3}>
          <CardContent>
            <Grid container justifyContent="space-between">
              <Typography sx={{ m: 1, p: 1 }} variant="h6" component="div">
                {thread?.subject}
              </Typography>

              <button onClick={deleteAllPosts}>Delete All Comments</button>

            </Grid>

            <Typography
              style={{ whiteSpace: "pre-line" }}
              sx={{ m: 1, p: 1 }}
              variant="body1"
            >
              {thread?.content}
            </Typography>

            <Typography sx={{ m: 1, p: 1 }} color="text.secondary">
              {thread?.anonymous && "Anonymous"
                ? "UserID: Anonymous, "
                : `UserID: ${thread?.creator_id} `}
              posted on {thread?.created}
            </Typography>
          </CardContent>
        </Card>

        <InfiniteScroll
          dataLength={posts.length} //This is important field to render the next data
          next={fetchData}
          hasMore={hasMore}
          loader={
            <h4 style={{ textAlign: "center", marginTop: 20 }}>Loading...</h4>
          }
          endMessage={
            <p
              style={{ textAlign: "center", marginTop: 40, color: "white" }}
              className="text-muted"
            >
              You have seen all the posts.
            </p>
          }
        >
          {/* lists of posts (PostCardItem) */}
          <div style={{ padding: 1 }}>
            {posts.map((post, index) => (
              <PostCardItem key={index} post={post} />
            ))}
          </div>
        </InfiniteScroll>
      </Container>

      <ReplyForm thread={thread} />
    </div>
  );
};

export default Thread;
