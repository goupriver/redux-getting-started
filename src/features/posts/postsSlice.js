import { createSlice, nanoid } from "@reduxjs/toolkit";
import { sub } from "date-fns";

const initialState = [
  {
    id: "1",
    title: "First Post",
    content: "Hello!",
    reactions: { thumbsUp: 0, hooray: 2, heart: 0, rocket: 4, eyes: 1 },
    user: "2",
    date: sub(new Date(), { minutes: 10 }).toISOString(),
  },
  {
    id: "2",
    title: "Second Post",
    content: "More Text",
    reactions: { thumbsUp: 2, hooray: 1, heart: 0, rocket: 1, eyes: 0 },
    user: "3",
    date: sub(new Date(), { minutes: 3 }).toISOString(),
  },
];

export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    // При использовании Immer вы можете либо «мутировать» существующий объект
    // состояния, либо самостоятельно возвращать новое значение состояния,
    // но не то и другое одновременно.
    postAdded: {
      reducer: (state, action) => {
        state.push(action.payload);
      },
      // Функция «подготовить обратный вызов» может принимать несколько аргументов,
      // генерировать случайные значения, такие как уникальные идентификаторы,
      // и запускать любую другую синхронную логику, необходимую для определения
      // того, какие значения попадают в объект действия. Затем он должен
      // вернуть объект с payload полем внутри.
      //
      // Теперь нашему компоненту не нужно беспокоиться о том, как выглядит
      // объект полезной нагрузки — создатель действия позаботится о том,
      // чтобы правильно его собрать. Итак, мы можем обновить компонент,
      // чтобы он передавался в качестве аргументов content title при отправке postAdded:
      prepare: (title, content, userId) => {
        return {
          payload: {
            id: nanoid(),
            // Действия и состояние Redux должны содержать только простые
            // значения JS, такие как объекты, массивы и примитивы. Не помещайте
            // экземпляры классов, функции или другие несериализуемые значения в Redux!.
            // Мы не можем поместить Date экземпляр класса в хранилище Redux,
            // помещаем его в виде строки метки времени:
            date: new Date().toISOString(),
            title,
            content,
            user: userId,
            reactions: { thumbsUp: 0, hooray: 0, heart: 0, rocket: 0, eyes: 0 },
          },
        };
      },
    },
    postUpdated: (state, action) => {
      // Если действие должно содержать уникальный идентификатор или какое-либо
      // другое случайное значение, всегда сначала сгенерируйте его
      // и поместите в объект действия. Редукторы никогда не должны вычислять
      //  случайные значения , потому что это делает результаты непредсказуемыми.
      const { id, title, content } = action.payload;
      const existingPost = state.find((post) => post.id === id);

      if (existingPost) {
        existingPost.title = title;
        existingPost.content = content;
      }
    },
    // Наш объект действия содержит минимальное количество информации, необходимой
    // для описания того, что произошло . Мы знаем, какой пост нам нужно обновить,
    // и на какое название реакции кликнули. Мы могли бы рассчитать новое значение
    // счетчика реакции и поместить его в действие, но всегда лучше, чтобы объекты
    // действия были как можно меньше, а вычисления обновления состояния выполнялись
    // в редюсере. Это также означает, что редукторы могут содержать столько логики,
    // сколько необходимо для вычисления нового состояния.
    reactionAdded: (state, action) => {
      const { postId, reaction } = action.payload;
      const existingPost = state.find((post) => post.id === postId);

      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    },
  },
});

export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;
