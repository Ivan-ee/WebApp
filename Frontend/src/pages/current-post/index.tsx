import { useParams } from "react-router-dom"
import { Card } from "../../components/cart"
// import { CreateComment } from "../../components/layout"
import { GoBack } from "../../components/go-back"
import {useGetPostByIdQuery} from "../../app/services/postApi";
import {CreateComment} from "../../components/create-comment";

export const CurrentPost = () => {
    const params = useParams<{ id: string }>()
    const { data } = useGetPostByIdQuery(params?.id ?? "")

    if (!data) {
        return <h2>Поста не существует</h2>
    }

    const {
        content,
        id,
        authorId,
        comments,
        likes,
        author,
        likedByUser,
        createdAt,
    } = data

    return (
        <>
            <GoBack />
            <Card
                cardFor="current-post"
                avatarUrl={author?.avatarUrl ?? ""}
                content={content}
                name={author?.name ?? ""}
                likesCount={likes.length}
                commentsCount={comments?.length}
                authorId={authorId}
                id={id}
                likedByUser={likedByUser}
                createdAt={createdAt}
                editMode={false}
            />
            <div className="mt-10">
                <CreateComment />
            </div>
            <div className="mt-10">
                {data.comments
                    ? data.comments.map((comment) => (
                        <Card
                            cardFor="comment"
                            key={comment.id}
                            avatarUrl={comment.user.avatarUrl ?? ""}
                            content={comment.content}
                            name={comment.user.name ?? ""}
                            authorId={comment.userId}
                            commentId={comment.id}
                            id={id}
                            editMode={false}
                        />
                    ))
                    : null}
            </div>
        </>
    )
}