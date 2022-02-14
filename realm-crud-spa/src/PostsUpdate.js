import { useEffect, useState } from 'react';
import Crud from "./Crud";

export default function PostsUpdate({mongodb, setMainContent, params: { passedId=0 }}) {
  const [id, setId] = useState(passedId);
  const [formId, setFormId] = useState(passedId);
  const [documentNotFound, setDocumentNotFound] = useState(false);
  const [text, setText] = useState('');

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
            setText(result.text)
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

  const updatePost = (event) => {
    event.preventDefault();
    const query = { _id: id }
    const input = {
      $set: {
        text: text,
        timestamp: Date.now()
      }
    }
    const posts = mongodb.db("apollo-crud").collection("Posts")
    const result = posts.updateOne(query, input)
      .then(result => console.log(`Successfully updated item with _id: ${id}`))
      .then(result => {
        setText('');
        setMainContent({page: "PostsRead", params: { passedId: id }})
      })
      .catch(err => console.error(`Failed to insert item: ${err}`));
  }

  const handleUpdateChange = (event) => {
    setText(event.target.value);
  }

  const edit = () => {
    return(
      <form onSubmit={updatePost}>
        <div>
          <textarea id="postText" name="text" rows="3" cols="80" maxLength="255" value={text} onChange={handleUpdateChange}></textarea>
        </div>

        <button type="submit" onClick={updatePost}>Update</button>
      </form>

    )
  }

  return (
    <div>
      <Crud context="Posts" setMainContent={setMainContent} />
      {id == 0 ? noId() : edit()}
    </div>
  );
}
