import { useState } from 'react';
import Crud from "./Crud";

export default function PostsCreate({mongodb, setMainContent}) {
  const [text, setText] = useState('')

  const submitForm = (event) => {
    event.preventDefault();
    const input = {
      text: text,
      timestamp: Date.now()
    }
    const postsCollection = mongodb.db("apollo-crud").collection("Posts")
    const tagsCollection = mongodb.db("apollo-crud").collection("Tags")
    const conversationsCollection = mongodb.db("apollo-crud").collection("Conversations")
    let postId = "";
    postsCollection.insertOne(input)
      .then(result => {
        postId = result.insertedId
        return result
      })
      .then(result => console.log(`Successfully inserted item with _id: ${result.insertedId}`))
      .then(() => text.match(/#[\p{L}\p{N}]+/ugi)) // Find hashtags: Match the # followed by one or more characters or numbers in any language, as utf-16 globally and case insensitively
      .then(hashtags => hashtags !== null ? hashtags.map(ht => { return {tag: ht} }) : hashtags )
      .then(hashtags => {
        // if one tag failed as a duplicate with insertMany it would stop processing the rest of the tags. ordered: false was being ignored
        hashtags && hashtags.map(hashtag => {
          tagsCollection.findOneAndUpdate(
            { tag: hashtag.tag },
            { $setOnInsert: hashtag },
            {
              returnNewDocument: true,
              upsert: true
            }
          )
            .then(result => console.log(`Successfully found or inserted tag ${hashtag.tag} with _id: ${result._id}`))
            .then(() => {
              let conversation = {tag: hashtag, post: postId}
              conversationsCollection.insertOne(conversation)
                .then(() => console.log(`Successfully added post ${postId} to conversation around ${hashtag.tag}`))
                .catch(err => console.error(`Failed to add post ${postId} to conversation around ${hashtag.tag}: ${err}`))
            })
            .catch(err => console.error(`Failed to insert tag: ${err}`))
          return hashtags
        })
      })
      .then(() => {
        setText('');
        setMainContent({page: "PostsIndex"})
      })
      .catch(err => console.error(`Failed to insert item: ${err}`));
  }

  const handleChange = (event) => {
    setText(event.target.value);
  }

  return (
    <div>
      <Crud context="Posts" setMainContent={setMainContent} />
      <h1>Create Post</h1>
      <form onSubmit={submitForm}>
        <div>
          <textarea id="postText" name="text" rows="3" cols="80" maxLength="255" value={text} onChange={handleChange}></textarea>
        </div>

        <button type="submit" onClick={submitForm}>Post</button>
      </form>
    </div>
  );
}
