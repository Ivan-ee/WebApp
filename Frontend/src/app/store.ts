import type {Action, ThunkAction} from "@reduxjs/toolkit"
import {combineSlices, configureStore} from "@reduxjs/toolkit"
import {setupListeners} from "@reduxjs/toolkit/query"
import {useAppDispatch} from "./hooks";
import {api} from "./services/api";


export const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer
    },
})

export type AppStore = typeof store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = AppStore["dispatch"]
export type AppThunk<ThunkReturnType = void> = ThunkAction<
    ThunkReturnType,
    RootState,
    unknown,
    Action<string>
>
