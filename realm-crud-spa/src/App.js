import { useState, useEffect } from 'react';
import './App.css';
import POSTS_INDEX from './PostsIndex';
import POSTS_CREATE from './PostsCreate';
import POSTS_READ from "./PostsRead";
import POSTS_UPDATE from "./PostsUpdate";
import POSTS_DELETE from "./PostsDelete";
import TAGS_INDEX from "./TagsIndex";
import TAGS_CREATE from "./TagsCreate";
import TAGS_READ from "./TagRead";
import * as Realm from "realm-web";


function App() {
  // MongoDB Connection
  const REALM_APP_ID = "apollo-crud-ehvhk";
  const [app] = useState(new Realm.App({ id: REALM_APP_ID }));
  const [user, setUser] = useState(false);

  useEffect(() => {
    async function loginAnonymous() {
      if (!!user) return
      // Create an anonymous credential
      const credentials = Realm.Credentials.anonymous();
      try {
        // Authenticate the user
        const someUser = await app.logIn(credentials);
        setUser(someUser);
        // `App.currentUser` updates to match the logged in user
        // assert(user.id === app.currentUser.id)
        console.log("Successfully logged in!", someUser)
        return
      } catch(err) {
        console.error("Failed to log in", err);
      }
    }
    loginAnonymous();
  }, [app, user])

  useEffect(() => {
    clicked("PostsIndex")
  }, [user])

  const [mongodb] = useState(app.currentUser.mongoClient("mongodb-atlas"));

  const COMPONENTS = {
    "PostsIndex": POSTS_INDEX,
    "PostsCreate": POSTS_CREATE,
    "PostsDelete": POSTS_DELETE,
    "PostsRead": POSTS_READ,
    "PostsUpdate": POSTS_UPDATE,
    "TagsIndex": TAGS_INDEX,
    "TagsCreate": TAGS_CREATE,
    "TagsRead": TAGS_READ
  }

  const [mainContent, setMainContent] = useState({ page: "PostsIndex", params: {} });

  const clicked = (page) => {
    setMainContent({ page, params: {} });
  }

  const components = (component) => {
    let Component = COMPONENTS[component["page"]];
    return (
      <Component setMainContent={setMainContent} mongodb={mongodb} params={component["params"]} />
    )
  }

  return (
    <div className="App">
      <nav>
        <button onClick={() => clicked("PostsIndex")}>Posts</button>
        <button onClick={() => clicked("TagsIndex")}>Tags</button>
      </nav>
      <main>
        {components(mainContent)}
      </main>
    </div>
  );
}

export default App;
