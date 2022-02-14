import {useEffect, useState} from "react";

export default function Tags({mongodb, id, tag, setMainContent, showLarge=false}) {
  const readClicked = (event) => {
    event.preventDefault();
    setMainContent({ page: "TagsRead", params: { passedId: id, tag: tag }});
  }

  const large = () => <h1 onClick={readClicked.bind(this)}>{tag.tag}</h1>
  const regular = () => <span onClick={readClicked.bind(this)}>{tag.tag}</span>

  return (
    <div className="tag">
      { showLarge ? large() : regular() }
    </div>
  );
}
