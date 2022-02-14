export default function Posts({id, text, group, timestamp, setMainContent}) {
  const readClicked = (event) => {
    event.preventDefault();
    setMainContent({ page: "PostsRead", params: { passedId: id }});
  }

  const updateClicked = (event) => {
    event.preventDefault();
    setMainContent({ page: "PostsUpdate", params: { passedId: id}});
  }

  const deleteClicked = (event) => {
    event.preventDefault();
    setMainContent({ page: "PostsDelete", params: { passedId: id}});
  }

  return (
    <div className="post">
      <p>
        {text}<br />
        <small>
          {new Date(timestamp).toLocaleString("en-US")}&nbsp;&nbsp;
          {group && "Found in conversation " + group}<br />
          <span onClick={readClicked.bind(this)}>Read</span>&nbsp;&nbsp;
          <span onClick={updateClicked.bind(this)}>Update</span>&nbsp;&nbsp;
          <span onClick={deleteClicked.bind(this)}>Delete</span>
        </small>
      </p>
    </div>
  );
}
