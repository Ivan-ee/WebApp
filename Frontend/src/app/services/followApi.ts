import {api} from "./api"

export const followApi = api.injectEndpoints({
    endpoints: (builder) => ({
        followUser: builder.mutation<void, { followingId: string }>({
            query: (body) => ({
                url: `/follow`,
                method: "POST",
                body: body,
            }),
        }),
        unfollowUser: builder.mutation<void, string>({
            query: (id) => ({
                url: `/unfollow/${id}`,
                method: "DELETE",
            }),
        }),
    }),
})

export const {
    useFollowUserMutation,
    useUnfollowUserMutation
} = followApi

export const {
    endpoints: {followUser, unfollowUser},
} = followApi