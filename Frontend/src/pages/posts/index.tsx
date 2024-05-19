import {Card} from "../../components/cart"
import {CreatePost} from "../../components/create-post"
import {useGetAllPostsQuery} from "../../app/services/postApi"

export const Posts = () => {
    const {data} = useGetAllPostsQuery()

    return (
        <>
            <div className="mb-10 w-full flex">
                <CreatePost/>
            </div>
            {data && data.length > 0
                ? data.map(
                    ({
                         content,
                         author,
                         id,
                         authorId,
                         comments,
                         likes,
                         likedByUser,
                         createdAt,
                     }) => (
                        <Card
                            key={id}
                            avatarUrl={author.avatarUrl ?? ""}
                            content={content}
                            name={author.name ?? ""}
                            likesCount={likes.length}
                            commentsCount={comments.length}
                            authorId={authorId}
                            id={id}
                            likedByUser={likedByUser}
                            createdAt={createdAt}
                            cardFor="post"
                        />
                    ),
                )
                : null}
        </>
    )
}