import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { PostAuthor } from "./PostAuthor";
import { selectPostById } from "./postsSlice";
import { ReactionButtons } from "./ReactionButtons";
import { TimeAgo } from "./TimeAgo";

export const SinglePostPage = () => {
  const { postId } = useParams();

  // Важно отметить, что компонент будет повторно отображать каждый раз,
  // когда значение, возвращаемое from useSelector, изменяется на новую ссылку.
  // Компоненты всегда должны пытаться выбрать из хранилища наименьший возможный
  // объем данных, который им нужен, что поможет гарантировать, что они будут
  // отображаться только тогда, когда это действительно необходимо.
  const post = useSelector((state) => selectPostById(state, postId));

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    );
  }

  return (
    <section>
      <article className="post">
        <h2>{post.title}</h2>
        <TimeAgo timestamp={post.date} />
        <p className="post-content">{post.content}</p>
        <PostAuthor userId={post.user} />
        <Link to={`/editPost/${post.id}`} className="button">
          Edit Post
        </Link>
        <ReactionButtons post={post} />
      </article>
    </section>
  );
};
