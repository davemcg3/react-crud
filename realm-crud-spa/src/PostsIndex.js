import { useState, useEffect } from 'react';
import Crud from "./Crud";
import Post from "./Post";

export default function PostsIndex({mongodb, setMainContent}) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const postsCollection = mongodb.db("apollo-crud").collection("Posts");
    postsCollection.find({})
      // .sort({ _id: 1 })
      .then(items => setPosts(items))
      .catch(err => console.error(`Failed to find documents: ${err}`))
  }, [])

  const displayPosts = () => {
    let output = [];
    if (posts.length > 0) {
      posts
        .map((post) => output.push(<Post key={post._id} id={post._id} text={post.text} group={post.group} timestamp={post.timestamp}
                             setMainContent={setMainContent}/>))
    } else {
      output.push(<Post key="1" id="1" text="No posts found!" timestamp={Date.now()}/>)
    }
    return output;
  }

  return (
    <div>
      <Crud context="Posts" setMainContent={setMainContent} />
      <h1>Timeline</h1>
      {displayPosts()}
    </div>
  );
}
