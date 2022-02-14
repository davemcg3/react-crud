export default function Conversation({id, setMainContent, tag, posts=[]}) {
  const emptyConversation = { id: "", tag: "", posts: [] }

  const readClicked = (event) => {
    event.preventDefault();
    setMainContent({ page: "ConversationRead", params: { passedId: id }});
  }

  const updateClicked = (event) => {
    event.preventDefault();
    setMainContent({ page: "ConversationUpdate", params: { passedId: id}});
  }

  const deleteClicked = (event) => {
    event.preventDefault();
    setMainContent({ page: "ConversationDelete", params: { passedId: id}});
  }

  return (
    <div className="tag">
      <p>
        {tag}
      </p>
    </div>
  );
}
