import { api } from "./api"
import { Post, Theme } from "../types"

export const themeApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllThemes: builder.query<Theme[], void>({
            query: () => ({
                url: "/themes",
                method: "GET"
            })
        }),
        getThemeById: builder.query<Theme, string>({
            query: (id) => ({
                url: `/themes/${id}`,
                method: "GET"
            })
        })
    })
})

export const {
    useGetAllThemesQuery,
    useLazyGetAllThemesQuery,
    useLazyGetThemeByIdQuery,
    useGetThemeByIdQuery
} = themeApi

export const {
    endpoints: { getAllThemes }
} = themeApi
