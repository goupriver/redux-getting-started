import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
  // status: 'idle' | 'loading' | 'succeeded' | 'failed',
  status: "idle",
  error: null,
};

// TODO: Создать thunk на добавление реакции, и обновление постов на сервере.

// createAsyncThunk принимает два аргумента:
// Первый - строка которая будет отображаться в качестве префикса для сгенерированных
//  типов действий.
// Второй - функция обратного вызова "создать полезной нагрузки"
//  которая должна возвращать Promise содержащий некоторые данные или отклоненный promise
//  с ошибкой

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const response = await fetch("http://localhost:3003/posts");
  const data = await response.json();

  return data;
});

export const addNewPost = createAsyncThunk(
  "posts/addNewPost",
  async (initialPost) => {
    const response = await fetch("http://localhost:3003/posts", {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },

      body: JSON.stringify({
        ...initialPost,
        date: new Date().toISOString(),
        reactions: { thumbsUp: 0, hooray: 0, heart: 0, rocket: 0, eyes: 0 },
      }),
    });

    const data = await response.json();

    return data;
  }
);

export const reactionAdded = createAsyncThunk(
  "posts/reactionAdded",
  async (details) => {
    const response = await fetch(
      `http://localhost:3003/posts/${details.postId}`,
      {
        method: "PATCH",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
          reactions: {
            ...details.reactions,

            [details.reaction]: details.reactions[details.reaction] + 1,
          },
        }),
      }
    );

    const data = await response.json();

    return {
      postId: details.postId,
      reaction: details.reaction,
      count: data.reactions[details.reaction],
    };
  }
);

export const postUpdated = createAsyncThunk(
  "posts/postUpdated",
  async (details) => {
    const { id, title, content } = details;

    const response = await fetch(`http://localhot:3003/posts/${id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        title,
        content,
      }),
    });

    const data = await response.json();

    return {
      postId: id,
      title: data.title,
      content: data.content,
    };
  }
);

export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    // При использовании Immer вы можете либо «мутировать» существующий объект
    // состояния, либо самостоятельно возвращать новое значение состояния,
    // но не то и другое одновременно.
    // postAdded: {
    //   reducer: (state, action) => {
    //     state.posts.push(action.payload);
    //   },
    //   // Функция «подготовить обратный вызов» может принимать несколько аргументов,
    //   // генерировать случайные значения, такие как уникальные идентификаторы,
    //   // и запускать любую другую синхронную логику, необходимую для определения
    //   // того, какие значения попадают в объект действия. Затем он должен
    //   // вернуть объект с payload полем внутри.
    //   //
    //   // Теперь нашему компоненту не нужно беспокоиться о том, как выглядит
    //   // объект полезной нагрузки — создатель действия позаботится о том,
    //   // чтобы правильно его собрать. Итак, мы можем обновить компонент,
    //   // чтобы он передавался в качестве аргументов content title при отправке postAdded:
    //   prepare: (title, content, userId) => {
    //     return {
    //       payload: {
    //         id: nanoid(),
    //         // Действия и состояние Redux должны содержать только простые
    //         // значения JS, такие как объекты, массивы и примитивы. Не помещайте
    //         // экземпляры классов, функции или другие несериализуемые значения в Redux!.
    //         // Мы не можем поместить Date экземпляр класса в хранилище Redux,
    //         // помещаем его в виде строки метки времени:
    //         date: new Date().toISOString(),
    //         title,
    //         content,
    //         user: userId,
    //         reactions: { thumbsUp: 0, hooray: 0, heart: 0, rocket: 0, eyes: 0 },
    //       },
    //     };
    //   },
    // },
    // postUpdated: (state, action) => {
    //   // Если действие должно содержать уникальный идентификатор или какое-либо
    //   // другое случайное значение, всегда сначала сгенерируйте его
    //   // и поместите в объект действия. Редукторы никогда не должны вычислять
    //   //  случайные значения , потому что это делает результаты непредсказуемыми.
    //   const { id, title, content } = action.payload;
    //   const existingPost = state.posts.find((post) => post.id === id);
    //   if (existingPost) {
    //     existingPost.title = title;
    //     existingPost.content = content;
    //   }
    // },
    // Наш объект действия содержит минимальное количество информации, необходимой
    // для описания того, что произошло . Мы знаем, какой пост нам нужно обновить,
    // и на какое название реакции кликнули. Мы могли бы рассчитать новое значение
    // счетчика реакции и поместить его в действие, но всегда лучше, чтобы объекты
    // действия были как можно меньше, а вычисления обновления состояния выполнялись
    // в редюсере. Это также означает, что редукторы могут содержать столько логики,
    // сколько необходимо для вычисления нового состояния.
    // reactionAdded: (state, action) => {
    //   const { postId, reaction } = action.payload;
    //   const existingPost = state.posts.find((post) => post.id === postId);
    //   if (existingPost) {
    //     existingPost.reactions[reaction]++;
    //   }
    // },
  },
  // Опция extraReducers должна быть функцией, которая получает параметр с именем builder.
  // Объект builderпредоставляет методы, которые позволяют нам определять дополнительные
  // редьюсеры case, которые будут запускаться в ответ на действия, определенные за пределами
  // слайса. Мы будем использовать builder.addCase(actionCreator, reducer)для обработки
  // каждого из действий, отправленных нашими асинхронными преобразователями.
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts = state.posts.concat(action.payload);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Обработка других статусов(ошибки и т.д) добавления
      // поста в самом компоненте "./AddPostForm"
      .addCase(addNewPost.fulfilled, (state, action) => {
        state.posts.push(action.payload);
      })
      .addCase(reactionAdded.fulfilled, (state, action) => {
        const { postId, reaction, count } = action.payload;

        state.posts.forEach((post) => {
          if (post.id === postId) {
            post.reactions[reaction] = count;
          }
        });
      })
      .addCase(postUpdated.fulfilled, (state, action) => {
        const { postId, title, content } = action.payload;

        state.posts.forEach((post) => {
          if (post.id === postId) {
            post.title = title;
            post.content = content;
          }
        });
      });
  },
});

// экспорт синхронных экшенов
// export const { postAdded } = postsSlice.actions;

export default postsSlice.reducer;

// здесь state глобальный со всего стора, а не конкретно из этого среза
// поэтому такая структура state.posts.posts
export const selectAllPosts = (state) => state.posts.posts;
export const selectPostById = (state, postId) =>
  state.posts.posts.find((post) => post.id === postId);
