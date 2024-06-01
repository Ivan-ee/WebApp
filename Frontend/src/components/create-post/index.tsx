import { Button, Textarea, Select, SelectItem } from "@nextui-org/react"
import { IoMdCreate } from "react-icons/io"
import {
    useCreatePostMutation,
    useLazyGetAllPostsQuery
} from "../../app/services/postApi"
import { useForm, Controller } from "react-hook-form"
import { ErrorMessage } from "../error-message"
import { useLazyGetAllThemesQuery } from "../../app/services/themeApi"
import React, { useEffect, useState } from "react"
import { Theme } from "../../app/types"

export const CreatePost = () => {
    const [createPost] = useCreatePostMutation()
    const [triggerGetAllPosts] = useLazyGetAllPostsQuery()
    const [triggerGetAllThemes] = useLazyGetAllThemesQuery()

    const [themes, setThemes] = useState<Theme[]>([])
    const [textareaHasText, setTextareaHasText] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    const {
        handleSubmit,
        control,
        formState: { errors },
        setValue
    } = useForm()

    useEffect(() => {
        if (textareaHasText) {
            const fetchThemes = async () => {
                const response = await triggerGetAllThemes().unwrap()
                setThemes(response)
            }
            fetchThemes()
        }
    }, [textareaHasText, triggerGetAllThemes]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files !== null) {
            setSelectedFile(event.target.files[0])
        }
    };

    const onSubmit = handleSubmit(async (data) => {
        console.log(data)
        try {

            const formData = new FormData(); // Создайте FormData
            formData.append("content", data.post); // Добавьте текст поста
            formData.append("themeId", data.selectedTheme); // Добавьте выбранную тему

            if (selectedFile) {
                formData.append("postImage", selectedFile);
            }

            await createPost(formData).unwrap();

            setValue("post", "")
            setSelectedFile(null);
            setValue("selectedTheme", "")

            setTextareaHasText(false)
            await triggerGetAllPosts().unwrap()
        } catch (error) {
            console.log("err", error)
        }
    })
    const errorPost = errors?.post?.message as string
    const errorTheme = errors?.selectedTheme?.message as string

    return (
        <form className="flex-grow" onSubmit={onSubmit}>
            <Controller
                name="post"
                control={control}
                defaultValue=""
                rules={{
                    required: "Текст поста отсутсвует"
                }}
                render={({ field }) => (
                    <Textarea
                        {...field}
                        labelPlacement="outside"
                        placeholder="О чем думайте?"
                        className="mb-5"
                        onChange={(e) => {
                            setTextareaHasText(e.target.value.trim() !== "")
                            field.onChange(e)
                        }}
                    />
                )}
            />

            {textareaHasText && (
                <div>
                    <Controller
                        name="selectedTheme"
                        control={control}
                        defaultValue={""}
                        rules={{ required: "Тема не выбрана" }}
                        render={({ field }) => (
                            <Select className="max-w-xs" label="Выберите тему" {...field}>
                                {themes.map((theme) => (
                                    <SelectItem key={theme.id} value={theme.id}>
                                        {theme.name}
                                    </SelectItem>
                                ))}
                            </Select>
                        )}
                    />

                    <input
                        name="avatarUrl"
                        placeholder="Выберете файл"
                        type="file"
                        onChange={handleFileChange}
                    />
                </div>
            )}

            {
                errors && <ErrorMessage error={errorTheme} />
            }
            {
                errors && <ErrorMessage error={errorPost} />
            }

            <Button
                color="success"
                className="flex-end"
                endContent={<IoMdCreate />}
                type="submit"
            >
                Добавить пост
            </Button>
        </form>
    )
}
