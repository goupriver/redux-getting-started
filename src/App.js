import { Route, BrowserRouter, Routes } from "react-router-dom";

import { Navbar } from "./app/Navbar";
import { PostsList } from "./features/posts/PostsList";
import { AddPostForm } from "./features/posts/AddPostForm";
import { SinglePostPage } from "./features/posts/SinglePostPage";
import { EditPostForm } from "./features/posts/EditPostForm";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <AddPostForm />
                <PostsList />
              </>
            }
          />
          <Route path="posts/:postId" element={<SinglePostPage />} />
          <Route path="editPost/:postId" element={<EditPostForm />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
