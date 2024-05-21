# Основные компоненты Redux Toolkit:

### Store:

Хранилище данных: Это центральное хранилище для всех данных приложения.
Создается функцией configureStore:

```
   export const store = configureStore({
       reducer: {
           [api.reducerPath]: api.reducer,
           auth,
       },
       middleware: (getDefaultMiddleware) =>
           getDefaultMiddleware()
               .concat(api.middleware)
               .prepend(listenerMiddleware.middleware),
      })
   })
```


**Reducers:**
- api.reducerPath: Этот reducer управляет состоянием сетевых запросов, генерируемых @reduxjs/toolkit/query/react.
- auth: Reducer для управления состоянием аутентификации пользователя, который находится в features/userSlice.js.

**Middleware:**
- getDefaultMiddleware(): Предоставляет стандартные middleware, которые оптимизируют работу Redux.
- api.middleware: Middleware для обработки сетевых запросов с помощью @reduxjs/toolkit/query/react.
- listenerMiddleware.middleware: Custom middleware для обработки событий аутентификации.


### userSlice
- initialState: Определяет начальное состояние slice, которое содержит информацию о пользователе, аутентификации и token.

**Reducers:**
- logout: Сбрасывает состояние slice в начальное.
- resetUser: Сбрасывает объект user в null. Нужно для обновления пользователя.

**ExtraReducers**
- userApi.endpoints.login.matchFulfilled: Обновляет token и isAuthenticated, если логин успешен.
- userApi.endpoints.current.matchFulfilled: Обновляет current и устанавливает isAuthenticated в true, если получена информация о текущем пользователе.
- userApi.endpoints.getUserById.matchFulfilled: Обновляет объект user.


### Middleware Auth.js
- Создает custom middleware listenerMiddleware для обработки событий аутентификации.
- startListening: Этот метод добавляет слушатель для определенных событий
- effect: Функция, которая выполняется при срабатывании слушателя. В этом случае сохраняет полученный token в localStorage.


