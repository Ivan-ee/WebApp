import {
    Card as NextUiCard,
    CardHeader,
    CardBody,
    CardFooter
} from "@nextui-org/react"
import {BASE_URL} from "../../constants"
// import { MetaInfo } from "../meta-info"
import { Typography } from "../typography"
import { FormatToClient } from "../../utils/format-to-client"
import { User } from "../user"
import { Link, useNavigate } from "react-router-dom"
import { FaRegComment } from "react-icons/fa6"
import { FcDislike } from "react-icons/fc"
import { MdOutlineFavoriteBorder } from "react-icons/md"
import { RiDeleteBinLine } from "react-icons/ri"
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { useSelector } from "react-redux"
import { useDeleteCommentMutation } from "../../app/services/commentsApi"
import { Spinner } from "@nextui-org/react"
import { ErrorMessage } from "../error-message"
import { useState } from "react"
import { useLikePostMutation, useUnlikePostMutation } from "../../app/services/likeApi"
import { useDeletePostMutation, useLazyGetAllPostsQuery, useLazyGetPostByIdQuery } from "../../app/services/postApi"
import { selectCurrent } from "../../features/userSlice"
import { hasErrorField } from "../../utils/has-error-filed"
import { MetaInfo } from "../meta-info"

type Props = {
    avatarUrl: string
    name: string
    authorId: string
    content: string
    commentId?: string
    likesCount?: number
    commentsCount?: number
    createdAt?: Date
    id?: string
    cardFor: "comment" | "post" | "current-post"
    likedByUser?: boolean
    theme: string
    postImage?: string
}

export const Card = ({
                         avatarUrl = "",
                         name = "",
                         content = "",
                         authorId = "",
                         id = "",
                         likesCount = 0,
                         commentsCount = 0,
                         cardFor = "post",
                         likedByUser = false,
                         createdAt,
                         commentId = "",
                         theme = "",
                         postImage = ""
                     }: Props) => {
    const [likePost] = useLikePostMutation()
    const [unlikePost] = useUnlikePostMutation()
    const [triggerGetAllPosts] = useLazyGetAllPostsQuery()
    const [triggerGetPostById] = useLazyGetPostByIdQuery()
    const [deletePost, deletePostStatus] = useDeletePostMutation()
    const [deleteComment, deleteCommentStatus] = useDeleteCommentMutation()
    const [error, setError] = useState("")
    const navigate = useNavigate()
    const currentUser = useSelector(selectCurrent)

    const refetchPosts = async () => {
        switch (cardFor) {
            case "post":
                await triggerGetAllPosts().unwrap()
                break
            case "current-post":
            case "comment":
                await triggerGetPostById(id).unwrap()
                break
            default:
                throw new Error("Неверный аргумент cardFor")
        }
    }


    const handleClick = async () => {
        try {
            likedByUser
                ? await unlikePost(id).unwrap()
                : await likePost({ postId: id }).unwrap()

            await refetchPosts()
        } catch (err) {
            if (hasErrorField(err)) {
                setError(err.data.error)
            } else {
                setError(err as string)
            }
        }
    }

    const handleDelete = async () => {
        try {
            switch (cardFor) {
                case "post":
                    await deletePost(id).unwrap()
                    await refetchPosts()
                    break
                case "current-post":
                    await deletePost(id).unwrap()
                    navigate("/")
                    break
                case "comment":
                    await deleteComment(commentId).unwrap()
                    await refetchPosts()
                    break
                default:
                    throw new Error("Неверный аргумент cardFor")
            }

        } catch (err) {
            console.log(err)
            if (hasErrorField(err)) {
                setError(err.data.error)
            } else {
                setError(err as string)
            }
        }
    }

    console.log(avatarUrl)

    return (
        <NextUiCard className="mb-5">
            <CardHeader className="justify-between items-center bg-transparent">
                <Link to={`/users/${authorId}`}>
                    <User
                        name={name}
                        className="text-small font-semibold leading-none text-default-600"
                        avatarUrl={avatarUrl}
                        description={createdAt && FormatToClient(createdAt)}
                    />
                </Link>
                {authorId === currentUser?.id && (
                    <div className="cursor-pointer" onClick={handleDelete}>
                        {deletePostStatus.isLoading || deleteCommentStatus.isLoading ? (
                            <Spinner />
                        ) : (
                            <RiDeleteBinLine />
                        )}
                    </div>
                )}
            </CardHeader>
            <CardBody className="px-3 py-2 mb-5">
                <Typography>{content}</Typography>
                {postImage && (
                    <img
                        src={`${BASE_URL}${postImage}`}
                        alt="Post Avatar"
                        className="w-auto"
                    />
                )}
            </CardBody>
            {cardFor !== "comment" && (
                <CardFooter className="gap-3">
                    <div className="mt-2">
                        {theme && <p className="text-gray-600">{theme}</p>}
                    </div>
                    <div className="flex gap-5 items-center">
                        <div onClick={handleClick}>
                            <MetaInfo
                                count={likesCount}
                                Icon={likedByUser ? FcDislike : MdOutlineFavoriteBorder}
                            />
                        </div>
                        <Link to={`/posts/${id}`}>
                            <MetaInfo count={commentsCount} Icon={FaRegComment} />
                        </Link>
                    </div>
                    <ErrorMessage error={error} />
                </CardFooter>
            )}
        </NextUiCard>
    )
}