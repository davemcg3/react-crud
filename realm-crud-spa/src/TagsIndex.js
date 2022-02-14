import Crud from "./Crud";
import {useEffect, useState} from "react";
import Tag from "./Tag";

export default function TagsIndex({mongodb, setMainContent}) {
  const [tags, setTags] = useState([]);
  useEffect(() => {
    const tagsCollection = mongodb.db("apollo-crud").collection("Tags");
    tagsCollection.find({})
      // .sort({ _id: 1 })
      .then(items => setTags(items))
      .catch(err => console.error(`Failed to find documents: ${err}`))
  }, [])

  return (
    <div>
      <Crud context="Tags" setMainContent={setMainContent} inclusions={["Create"]} />
      <h1>Tags Index</h1>
      {tags.map((tag) => <Tag key={tag._id} id={tag._id} tag={tag} setMainContent={setMainContent} mongodb={mongodb} />)}
    </div>
  );
}
