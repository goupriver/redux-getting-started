import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNewPost } from "./postsSlice";

export const AddPostForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");
  const [addRequestStatus, setAddRequestStatus] = useState("idle");

  const dispatch = useDispatch();

  const users = useSelector((state) => state.users);

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onContentChanged = (e) => setContent(e.target.value);
  const onAuthorChanged = (e) => setUserId(e.target.value);

  const canSave =
    [title, content, userId].every(Boolean) && addRequestStatus === "idle";

  // Когда мы вызываем dispatch(addNewPost()), асинхронный преобразователь
  // возвращает a Promise from dispatch. Здесь мы можем await пообещать узнать,
  // когда преобразователь завершит свой запрос. Но мы еще не знаем, был ли этот
  // запрос успешным или неудачным.
  // Redux Toolkit добавляет .unwrap() функцию к Promise , которая вернет
  // new Promise, которая либо имеет фактическое action.payload значение из fulfilled
  // действия, либо выдает ошибку, если это rejected действие. Это позволяет нам
  // обрабатывать успехи и неудачи в на уровне компонента, а не в редьюсере, используя обычную try/catch логику.
  // Итак, мы очистим поля ввода, чтобы сбросить форму, если сообщение было успешно
  // создано, и зарегистрируем ошибку в консоли, если это не удалось.
  const onSavePostClicked = async () => {
    if (canSave) {
      try {
        setAddRequestStatus("pending");
        await dispatch(
          addNewPost({
            title,
            content,
            userId,
          })
        ).unwrap();

        setContent("");
        setTitle("");
        setUserId("");
      } catch (error) {
        console.error("Failed to saved the post: ", error.message);
      } finally {
        setAddRequestStatus("idle");
      }
    }
  };

  const usersOptions = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ));

  return (
    <section>
      <h2>Add a New Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          placeholder="What's on your mind?"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postAuthor">Author:</label>
        <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
          <option value=""></option>
          {usersOptions}
        </select>
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
        <button type="button" onClick={onSavePostClicked} disabled={!canSave}>
          Save Post
        </button>
      </form>
    </section>
  );
};
