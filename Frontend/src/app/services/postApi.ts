import {api} from "./api";
import {Post} from "../types";

export const postApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createPost: builder.mutation<Post,  FormData>({
            query: (postData) => ({
                url: "/posts",
                method: "POST",
                body: postData,
            }),
        }),
        updatePost: builder.mutation<Post, { postId: string; postData: FormData }>({
            query: ({ postId, postData }) => ({
                url: `/posts/update/${postId}`,
                method: "PUT",
                body: postData,
            }),

        }),
        getAllPosts: builder.query<Post[], void>({
            query: () => ({
                url: "/posts",
                method: "GET",
            }),
        }),
        getPostById: builder.query<Post, string>({
            query: (id) => ({
                url: `/posts/${id}`,
                method: "GET",
            }),
        }),
        deletePost: builder.mutation<void, string>({
            query: (id) => ({
                url: `/posts/${id}`,
                method: "DELETE",
            }),
        }),
    }),
})

export const {
    useCreatePostMutation,
    useGetAllPostsQuery,
    useGetPostByIdQuery,
    useDeletePostMutation,
    useLazyGetAllPostsQuery,
    useLazyGetPostByIdQuery,
    useUpdatePostMutation,
} = postApi

export const {
    endpoints: { createPost, getAllPosts, getPostById, deletePost, updatePost },
} = postApi
