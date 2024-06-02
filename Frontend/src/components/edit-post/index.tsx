import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader, Select, SelectItem,
    Textarea
} from "@nextui-org/react"
import React, { useContext, useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { useLazyGetAllPostsQuery, useUpdatePostMutation } from "../../app/services/postApi"
import { Input } from "../input/input"
import { ErrorMessage } from "../error-message"
import { hasErrorField } from "../../utils/has-error-filed"
import { Post, Theme } from "../../app/types"
import { ThemeContext } from "../theme-provider"
import { useLazyGetAllThemesQuery } from "../../app/services/themeApi"

type Props = {
    isOpen: boolean
    onClose: () => void
    post: { id: string, content: string, themeId: string, image?: string }
}

export const EditPost: React.FC<Props> = ({
                                              isOpen = false,
                                              onClose = () => null,
                                              post
                                          }) => {
    const { theme } = useContext(ThemeContext)
    const [updatePost, { isLoading }] = useUpdatePostMutation()
    const [error, setError] = useState("")
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    const { handleSubmit, control, reset } = useForm({
        mode: "onChange",
        reValidateMode: "onBlur",
        defaultValues: {
            content: post.content.replace(/<[^>]+>/g, ''),
            selectedTheme: post.themeId
        }
    })

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files !== null) {
            setSelectedFile(event.target.files[0])
        }
    }

    const [triggerGetAllPosts] = useLazyGetAllPostsQuery();

    const onSubmit = async (data: { content: string, selectedTheme: string }) => {
        try {
            const formData = new FormData()
            formData.append("content", data.content)
            formData.append("themeId", data.selectedTheme)

            if (selectedFile) {
                formData.append("postImage", selectedFile)
            }



            await updatePost({ postData: formData, postId: post.id }).unwrap()

            onClose()
            await triggerGetAllPosts();
        } catch (err) {
            console.log(err)
            if (hasErrorField(err)) {
                setError(err.data.error)
            }
        }
    }

    const [triggerGetAllThemes] = useLazyGetAllThemesQuery()
    const [themes, setThemes] = useState<Theme[]>([])
    useEffect(() => {

        const fetchThemes = async () => {
            const response = await triggerGetAllThemes().unwrap()
            setThemes(response)
        }
        fetchThemes()

    }, [triggerGetAllThemes])

    const currentTheme = post.themeId;

    if (!post) return null;

    return (
        <Modal isOpen={isOpen}
               onClose={onClose}
               backdrop="blur"
               className={`${theme} text-foreground`}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>Редактирование поста</ModalHeader>
                        <ModalBody>
                            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                                <Controller
                                    name="content"
                                    control={control}
                                    render={({ field }) => (
                                        <Textarea {...field} rows={4} placeholder="Содержание поста" />
                                    )}
                                />

                                <Controller
                                    name="selectedTheme"
                                    control={control}
                                    rules={{ required: "Тема не выбрана" }}
                                    render={({ field }) => (
                                        <Select
                                            label="Выберите тему"
                                            defaultSelectedKeys={[`${currentTheme}`]}
                                            {...field} >
                                            {themes.map((theme) => (
                                                <SelectItem key={theme.id} value={theme.id} >
                                                    {theme.name}
                                                </SelectItem>
                                            ))}
                                        </Select>
                                    )}
                                />
                                <input
                                    name="image"
                                    type="file"
                                    onChange={handleFileChange}
                                />
                                <ErrorMessage error={error} />
                                <div className="flex justify-end gap-2">
                                    <Button color="primary" type="submit" isLoading={isLoading}>
                                        Обновить
                                    </Button>
                                    <Button color="danger" variant="light" onPress={onClose}>
                                        Закрыть
                                    </Button>
                                </div>
                            </form>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}