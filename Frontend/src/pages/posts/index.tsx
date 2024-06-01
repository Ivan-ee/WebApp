import {Card} from "../../components/cart"

import {useGetAllPostsQuery} from "../../app/services/postApi"
import {CreatePost} from "../../components/create-post";


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
                         theme, // Добавьте theme в массив данных поста
                         image
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
                            theme={theme.name}
                            postImage={image}
                        />
                    ),
                )
                : null}
        </>
    )
}