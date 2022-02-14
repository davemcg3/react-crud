import {useEffect, useState} from 'react';
import Crud from "./Crud";
import Tag from "./Tag";
import Post from "./Post";

export default function TagRead({mongodb, setMainContent, params: { passedId=0, tag }}) {
  const [renderCount, setRenderCount] = useState(1)
  const [conversation, setConversation] = useState([])
  const [posts, setPosts] = useState([])

  useEffect(() => {
    setRenderCount(renderCount + 1)
    const conversationsCollection = mongodb.db("apollo-crud").collection("Conversations");
    conversationsCollection.find({tag: { tag: tag.tag }})
      // .sort({ _id: 1 })
      .then(items => {
        setConversation(items.map(item => {
          return item?.post
        }))
        return items
      })
      .catch(err => console.error(`Failed to find documents: ${err}`))
  }, [mongodb])

  useEffect(() => {
    const postsCollection = mongodb.db("apollo-crud").collection("Posts");
    postsCollection.find({ _id: { $in: conversation } })
      .then(items => setPosts(items))
      .catch(err => console.error(`Failed to find documents: ${err}`))
  }, [mongodb, conversation])

  return (
    <div>
      <Crud context="Tags" setMainContent={setMainContent} />
      <Tag key={tag._id} id={tag._id} tag={tag} setMainContent={setMainContent} showLarge={true} />
      {posts.map(post => <Post key={post._id} id={post._id} text={post.text} group={post.group}
                     timestamp={post.timestamp} setMainContent={setMainContent}/>
      )}
    </div>
  );
}
