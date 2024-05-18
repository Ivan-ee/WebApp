import {api} from "./api";
import {Post} from "../types";

export const postApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createPost: builder.mutation<Post, { content: String }>({
            query: (postData) => ({
                url: '/posts',
                method: 'POST',
                body: postData
            })
        }),
        getAllPosts: builder.query<Post[], void>({
            query: () => ({
                url: '/posts',
                method: 'GET',
            })
        }),
        getPostById: builder.query<Post, String>({
            query: (id) => ({
                url: `/posts/${id}`,
                method: 'POST',
            })
        }),
        deletePost: builder.mutation<void, string>({
            query: (id) => ({
                url: `/posts/${id}`,
                method: "DELETE",
            }),
        }),
    })
});

export const {
    useCreatePostMutation,
    useGetAllPostsQuery,
    useGetPostByIdQuery,
    useDeletePostMutation,
    useLazyGetAllPostsQuery,
    useLazyGetPostByIdQuery,
} = postApi

export const {
    endpoints: { createPost, getAllPosts, getPostById, deletePost },
} = postApi