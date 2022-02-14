import Crud from "./Crud";

export default function TagsCreate({setMainContent}) {
  return (
    <div>
      <Crud context="Tags" setMainContent={setMainContent} inclusions={["Create"]} />
      <h1>Create a Tag</h1>
      Just use a hashtag in your tweet! Like this:<br />
      "Today I created a new #hashtag on this service."<br />
      If the hashtag doesn't exist it will be automatically created and added to the list.<br />
    </div>
  );
}
