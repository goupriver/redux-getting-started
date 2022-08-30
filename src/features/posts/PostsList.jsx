import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { PostAuthor } from "./PostAuthor";
import { fetchPosts, selectAllPosts } from "./postsSlice";
import { ReactionButtons } from "./ReactionButtons";
import { TimeAgo } from "./TimeAgo";

import { Spinner } from "../../components/Spinner";

const PostExcerpt = ({ post }) => (
  <article className="post-excerpt">
    <h3>{post.title}</h3>
    <TimeAgo timestamp={post.date} />
    <p className="post-content">{post.content.substring(0, 100)}</p>
    <PostAuthor userId={post.user} />
    <Link to={`posts/${post.id}`} className="button muted-button">
      View Post
    </Link>
    <ReactionButtons post={post} />
  </article>
);

export const PostsList = () => {
  // Функции-селекторы получают весь _state_ объект и должны возвращать значение
  // Селекторы будут повторно запускаться всякий раз, когда обновляется хранилище Redux,
  // и если данные, которые они возвращают, изменились, компонент будет повторно отображаться.
  const dispatch = useDispatch();

  const posts = useSelector(selectAllPosts);
  const postStatus = useSelector((state) => state.posts.status);
  const error = useSelector((state) => state.posts.error);

  useEffect(() => {
    if (postStatus === "idle") {
      dispatch(fetchPosts());
    }
  }, [postStatus, dispatch]);

  let content;

  if (postStatus === "loading") {
    content = <Spinner text="Loading..." />;
  } else if (postStatus === "succeeded") {
    const orderedPosts = posts
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date));

    content = orderedPosts.map((post) => (
      <PostExcerpt key={post.id} post={post} />
    ));
  } else if (postStatus === "failed") {
    content = <div>{error}</div>;
  }

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {content}
    </section>
  );
};
