import { useEffect, useState } from 'react';
import Crud from "./Crud";
import Post from "./Post";

export default function PostsDelete({mongodb, setMainContent, params: { passedId=0 }}) {
  const emptyPost = { text: "", group: "", timestamp: 0 }

  const [id, setId] = useState(passedId);
  const [formId, setFormId] = useState(passedId);
  const [post, setPost] = useState(emptyPost)
  const [documentNotFound, setDocumentNotFound] = useState(false);

  const submitForm = (event) => {
    event.preventDefault();
    setId(formId)
  }

  useEffect(() => {
    if (id !== 0) {
      const postsCollection = mongodb.db("apollo-crud").collection("Posts");
      const query = { "_id": id };
      postsCollection.findOne(query)
        .then(result => {
          if (result) {
            setPost(result)
            setDocumentNotFound(false)
          } else {
            setId(0)
            setDocumentNotFound(true)
          }
        })
        .catch(err => {
          console.error(`Failed to find document: ${err}`)
          setId(0)
        })
    }
  }, [id])

  const handleChange = (event) => {
    setFormId(event.target.value);
  }

  const noId = () => {
    return (
      <form onSubmit={submitForm}>
        <div>
          <label htmlFor="id">Id:</label>
        </div>
        <div>
          <input id="id" name="id" value={formId} onChange={handleChange}></input>
        </div>
        {documentNotFound && <p>Document Not Found</p>}
        <button type="submit" onClick={submitForm}>Select Id</button>
      </form>
    )
  }

  const deletePost = (event) => {
    event.preventDefault();
    const query = { _id: id }
    const posts = mongodb.db("apollo-crud").collection("Posts")
    const result = posts.deleteOne(query)
      .then(result => console.log(`Successfully deleted item with _id: ${id}`))
      .then(result => {
        setMainContent({page: "PostsIndex", params: {}})
      })
      .catch(err => console.error(`Failed to insert item: ${err}`));
  }

  const showPostToDelete = () => {
    return(
      <>
        <Post id={post._id} text={post.text} group={post.group} timestamp={post.timestamp} setMainContent={setMainContent} />
        <div>
          <label htmlFor="idToDelete">Delete this post?</label>
        </div>
        <button type="submit" onClick={deletePost} id="idToDelete">Yes</button>
        <button type="submit" onClick={() => {setMainContent({page: "PostsRead", params: { passedId: id }})}}>No</button>
      </>
    )
  }

  return (
    <div>
      <Crud context="Posts" setMainContent={setMainContent} />
      {id == 0 ? noId() : showPostToDelete()}
    </div>
  );
}
