- [Команды для запуска приложения](#commands)
- [Ветки](#branches)
- [Зависимости](#dependencies)
- [Структура приложения](#structure)
- [Шаги работы с RTK](#RTK)
  - [Стандартный синхронный поток данных redux](#stdsync)
    - [useSelector](#useSelector)
    - [createSlice](#useSelector)
  - [Асинхронная логика. Промежуточное ПО (middlewere). thunk](#async)
    - [Асинхронный поток данных redux](#stdasync)
    - [Еще раз о селекторах (Селекторы)](#selectors)
    - [Redux Middleware](#middleware)
    - [createAsyncThunk](#cat)
    - [Основные пункты создания асинхронной логики.](#anchortext)

***

##### <span id="commands">Команды для запуска:</span>
  `npm install` - установка зависимостей
  `npm start` - запуск проекта  
  `npm run server` - запуск Fake API сервера ([json-server](https://github.com/typicode/json-server)). Некоторые настройки для сервера хранятся в корне проекта в файле __server.js__

##### <span id="branches">Ветки</span>
- в ветке __master__ - создание структуры проекта. Синхронные и асинхронные операции с данными(выборка и создание).  
- в ветке __performance__ - работа с производительностью
- в ветке __rtkq__ - работа с дополнительной асбтракцией _redux - redux toolkit query_

##### <span id="dependencies">Зависимости</span>
  - `react` (UI фреймворк)
  - `react-router-dom` (роутер на стороне клиента)
  - `@reduxjs/toolkit` (абстракция над redux)
  - `react-redux` (API для связи redux  и react компонентов)
  - `@faker-js/faker` (генерация случайных данных)
  - `date-fns` (удобное форматирование дат)
  - `json-server` fake REST API server

##### <span id="structure">Структура приложения:</span>
`Navbar.jsx`	 *Отображает верхний заголовок и содержимое навигации*        
`store.js` *создает экземпляр магазина Redux*  
`components` *папка компонентов*  
`App.js` *основной компоеннт приложения. Отображает верхнюю панель навигации и обрабатывает маршрутизацию на стороне клиента для другго содержимого*  
`index.js` *файл точки входа для приложения. Он отображает компонент <Provider> (из API  **react-redux**) и основной компоеннт <App>*   
`index.css` *стили для приложения*  

##### Функциональность:
- _Список постов_ (posts)
  - просмотр одного поста  
  - редактирование существующих постов  
  - отображение автора поста  
  - детали  поста  
  - метки времени публикации  
  - кнопки реакции на пост

 ##### <span id="RTK">Шаги работы с RTK.</span> 
  1. Компонент `<PostsList>` считывает список постов при инициализации из стора __useSelector__ и отображает исходный пользовательский интерфейс.  
  2. Мы отправляем _postAdded_ действие, содержащее данные для нового поста   
  3. Редьюсер постов принял _postAdded_ действие и обновил массив постов.  
  4. Стор Redux сообщил пользовательскому интерфейсу, что данные изменились.  
  5. `<PostsList>` прочитал из __useSelector__ новый массив постов и повторно отрисовывает 
  
  __<span id="stdsync">Стандартный синхронный поток данных redux</span>__ 

![стандартный поток данных redux](https://d33wubrfki0l68.cloudfront.net/01cc198232551a7e180f4e9e327b5ab22d9d14e7/b33f4/assets/images/reduxdataflowdiagram-49fa8c3968371d9ef6f2a1486bd40a26.gif)

__<span id="useSelector">useSelector</span>__  
  - __Функции-селекторы__ получают весь _state_ объект и должны возвращать значение  
  - Селекторы будут повторно запускаться всякий раз, когда обновляется хранилище Redux, и если данные, которые они возвращают, изменились, компонент будет повторно отображаться.  
  - Компоненты должны извлекать наименьшее количество данных, необходимых им для рендеринга.  
  
  __<span id="useSelector">createSlice</span>__ 
  - может принять поле _prepare_, который возвращает payload объект действия  
  - Уникальные идентификаторы и другие случайные значения должны быть введены в действие, а не вычисляться в редьюсере.  


##### <span id="async">Асинхронная логика. __Промежуточное ПО (middlewere). thunk</span>
Сам по себе Redux ничего не знает об асинхронной логике. Он знает только как синхронно отправлять действия, обновлять состояние, вызывая функцию корневого редьюсера и уведомлять пользовательский интерфейс о том, что что-то изменилось. __Любая асинхронность должна происходить вне хранилища__. 
Если вы хотите чтобы асинхронная логика взаимодействовала с хранилищем. Отпрваляя или проверяя текущее состояние хранилища. Вот тут то и появляется __промежуточное ПО Redux__.   

__Промежутоное ПО Redux позволяет__  
- Выполнение любой дополнительной логики при отправке любого действия (например регистрация действия или состояния)  
- Приостановить, отложить, изменить, заменить, оставновить отправление действия.  
- Напишите доп. код который имеет доступ к `dispatch` или `getState`  
- Позволяет `dispatch`  принимать другие значения кроме объектов, такие как: функции, промисы, перехватывая их и вместо этого отправлять реальные объекты действий.  

_Наиболее рапространенная причина использования промежуточного ПО - возможность взаимодействия с хранилищем любой асинхронной логики_  
__Наиболее распространенным асинхронным промежуточным ПО является `redux-thunk` которое позволяет писать вам обычные функции,которые могут содержать асинхронную логику.  
Функция `configureStore` из RTK автоматически устанавливает промежуточное ПО thunk по умолчанию.  
Когда мы вводим асинхронную логику, мы добавляем дополнительный шаг, когда промежуточное ПО может запустить логику которая , такую как запросы AJAX, а затем отправляь действия.

__<span id="stdasync">Асинхронный поток данных redux</span>__
  
![Асинхронный поток данных redux](https://redux.js.org/assets/images/ReduxAsyncDataFlowDiagram-d97ff38a0f4da0f327163170ccc13e80.gif)

Как только промежуточное ПО thunk добавлено в стор redux, оно позволяет вам передавать функции в `store.dispath`. Функция thunk всегда будет вызываться с аргументами `(dispath, getState)` и вы можете их использовать по мере необходимости. 
Middleware обычно отправляеют простые действия с помощью создателя действий, например `dispatch(increment())`   

В createSlice нет поддержки преобразователей поэтому преобразователи (thunk) оыбчно пишут в файлах slice как отдельные функции. Таким образом у них есть доступ к простым создателям действий.   


<ins>Логика получения данных для Redux обычно следует предсказуемой схеме</ins>:   

- Перед запросом отправляется действие _"start"_, чтобы указать что запрос выполняется. Это можно использовать для отслеживания состояия загрузки, чтобы пропускать повторяюшиеся запросы или отрбражать индикаторы загрузки в UI.   
- Асинхронный запрос сделан  
- В зависимости от результата запроса асинхронная логика отправляет либо действие _"успех"_, содержащий данные результата, либо действие _"сбой"_, содержащее сведения об ошибке. Логика редьюсера очищает состояние загрузки в обоих случаях и либо обрабатывает данные результата из успешного случая, либо сохраняет значение ошибки для возможного отображения.   

Эти шаги необязательны, но обычно используются.   
Если вам нужн только успешный результат, вы можете отправить действие "_успех_" после заверщения запроса и пропустить действие "_начало_"  и "_сбой_".      

RTK предоставляет `createAsyncThunk` API для реализации создания  и отправки этих действий.  

Когда мы делаем вызов API мы может наблюдать за его ходом в виде небольшго конечного автомата, который может находиться в одном из четырех возможных состояний:   
- Запрос еще не начался  
- Запрос находится в обработке  
- Запрос выполнен успешно и теперь у нас есть нужные данные  
- Запрос не выполнен, возмонжо, есть сообщение об ошибке.  

с Typescript состояние запроса можно отслежитвать таким образом:  
```javascript
{
  // Multiple possible status enum values
  status: 'idle' | 'loading' | 'succeeded' | 'failed',
  error: string | null
}
```
Без typescript можно использовать флаг
```javascript 
{
  isLoading: true,
  error: null
}
```
Мы можем использовать эту информацию, чтобы решить что показывать в UI по мере выполнения запроса, а так же добавить логику в наши редьюсеры, чтобы предотвратить двойную загрузку. 

##### <span id="selectors">Селекторы</span>
- Вы можете написать многократно используемые функции «селектора» для инкапсуляции значений чтения из состояния Redux.
- _Селекторы_ — это функции, которые получают Redux state в качестве аргумента и возвращают некоторые данные.

##### <span id="middleware">Redux Middleware</span>
- Redux использует плагины, называемые «промежуточным программным обеспечением», для включения асинхронной логики.
- Стандартное асинхронное промежуточное ПО называется redux-thunk, которое включено в Redux Toolkit .
- Функции Thunk получают dispatchи getState в качестве аргументов и могут использовать их как часть асинхронной логики.

##### <span id="cat">createAsyncThunk</span>
- Вы можете отправить дополнительные действия, чтобы отслеживать статус загрузки вызова API.
  - Типичный шаблон отправляет «ожидающее» действие перед вызовом, затем либо «успех»,       содержащий данные, либо «сбой», содержащий ошибку.
  - Состояние загрузки обычно должно храниться как перечисление, например'idle' | 'loading' | 'succeeded' | 'failed'
- Redux Toolkit имеет createAsyncThunkAPI, который отправляет эти действия за вас .
  - createAsyncThunkпринимает обратный вызов «создатель полезной нагрузки», который должен возвращать Promise, и автоматически генерирует pending/fulfilled/rejectedтипы действий
  - Создатели сгенерированных действий, такие как fetchPostsотправка этих действий на основе Promiseвашего возврата
  - Вы можете прослушивать эти типы действий при createSliceиспользовании extraReducersполя и обновлять состояние в редукторах на основе этих действий.
  - Создатели действий можно использовать для автоматического заполнения ключей extraReducersобъекта, чтобы срез знал, какие действия следует прослушивать.
  - Преобразователи могут возвращать обещания. В createAsyncThunkчастности, вы можете await dispatch(someThunk()).unwrap()обрабатывать успех или неудачу запроса на уровне компонентов.

 ##### <span id="anchortext">Основная пункты создания асинхронной логики.</span> 

  1. Создаем асинхронный экшен с помощью `createAsynThunk` из API `RTK`
  2. Вызываем этот экшен с помощью `dispatch` из API `react-redux`. Если нужно передаем параметры в экшен, createAsyncThunk может их принять.  
  3. Если нужно выполнить логику после загрузки-ошибки-успшного выполнения. Делаем этого в функции slice, в специальном объекте extraReducers в котором можно вызвать у экшена методы, rejected, fulfilled, failed. 
  4. Ошибки так же можно обработать на уровне компонента. Вызвав у `disaptch` метод unwrap, но функция при этом должна быть асинхронной.
