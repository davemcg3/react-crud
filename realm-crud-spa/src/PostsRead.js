import {useEffect, useState} from 'react';
import Crud from "./Crud";
import Post from "./Post";

export default function PostsRead({mongodb, setMainContent, params: { passedId=0 }}) {
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

  const read = () => {
    return(
      <Post id={post._id} text={post.text} group={post.group} timestamp={post.timestamp} setMainContent={setMainContent} />
    )
  }

  return (
    <div>
      <Crud context="Posts" setMainContent={setMainContent} />
      {id == 0 ? noId() : read()}
    </div>
  );
}
