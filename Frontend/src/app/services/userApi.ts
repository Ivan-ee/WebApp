import { api } from "./api"
import { User } from "../types"

export const userApi = api.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<{ token: string }, { email: string; password: string }>({
            query: (userData) => ({
                url: "/login",
                method: "POST",
                body: userData
            })
        }),
        register: builder.mutation<{ name: string; nickname: string; email: string;}, {
            name: string;
            nickname: string;
            email: string;
            password: string;
        }>({
            query: (userData) => ({
                url: "/register",
                method: "POST",
                body: userData
            })
        }),
        current: builder.query<User, void>({
            query: () => ({
                url: "/current",
                method: "GET"
            })
        }),
        getUserById: builder.query<User, String>({
            query: (id) => ({
                url: `/users/${id}`,
                method: "GET"
            })
        }),
        getAll: builder.query<User[], void>({
            query: () => ({
                url: `/all`,
                method: "GET"
            })
        }),
        updateUser: builder.mutation<User, { userData: FormData; id: string }>({
            query: ({ userData, id }) => ({
                url: `/users/${id}`,
                method: "PUT",
                body: userData
            })
        })
    })
})

export const {
    useRegisterMutation,
    useLoginMutation,
    useCurrentQuery,
    useLazyCurrentQuery,
    useGetUserByIdQuery,
    useLazyGetUserByIdQuery,
    useUpdateUserMutation,
    useGetAllQuery,
    useLazyGetAllQuery
} = userApi

export const {
    endpoints: { login, register, current, getUserById, updateUser, getAll }
} = userApi