import { Card } from "../../components/cart"

import { useGetAllPostsQuery } from "../../app/services/postApi"
import { CreatePost } from "../../components/create-post"
import { EditPost } from "../../components/edit-post"
import { useDisclosure } from "@nextui-org/react"
import { useParams } from "react-router-dom"
import { useState } from "react"


export const Posts = () => {
    const { data } = useGetAllPostsQuery()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [selectedPost, setSelectedPost] = useState<{
        id: string,
        content: string,
        themeId: string,
        image?: string
    } | null>(null)

    const handleEditClick = (post: { id: string, content: string, themeId: string, image?: string }) => {
        setSelectedPost(post)
        onOpen()
    }

    return (
        <>
            <div className="mb-10 w-full flex">
                <CreatePost />
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
                         theme,
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
                            onEdit={() => handleEditClick({ id, content, themeId: theme.id, image })}
                        />
                    )
                )
                : null}
            {selectedPost && (
                <EditPost
                    isOpen={isOpen}
                    onClose={() => {
                        onClose();
                        setSelectedPost(null);
                    }}
                    post={selectedPost}
                />
            )}
        </>
    )
}