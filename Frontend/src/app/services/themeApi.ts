import { api } from "./api"
import { Theme } from "../types"

export const themeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // createPost: builder.mutation<Post, { content: string }>({
    //   query: (postData) => ({
    //     url: "/posts",
    //     method: "POST",
    //     body: postData
    //   })
    // }),
    getAllThemes: builder.query<Theme[], void>({
      query: () => ({
        url: "/themes",
        method: "GET"
      })
    })
  })
})

export const {
  useGetAllThemesQuery,
  useLazyGetAllThemesQuery
} = themeApi

export const {
  endpoints: { getAllThemes }
} = themeApi
