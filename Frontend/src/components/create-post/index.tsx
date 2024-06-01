import { Button, Textarea, Select, SelectItem } from "@nextui-org/react"
import { IoMdCreate } from "react-icons/io"
import {
    useCreatePostMutation,
    useLazyGetAllPostsQuery
} from "../../app/services/postApi"
import { useForm, Controller } from "react-hook-form"
import { ErrorMessage } from "../error-message"
import { useLazyGetAllThemesQuery } from "../../app/services/themeApi"
import { useEffect, useState } from "react"
import { Theme } from "../../app/types"

export const CreatePost = () => {
    const [createPost] = useCreatePostMutation()
    const [triggerGetAllPosts] = useLazyGetAllPostsQuery()
    const [triggerGetAllThemes] = useLazyGetAllThemesQuery()

    const [themes, setThemes] = useState<Theme[]>([])
    const [textareaHasText, setTextareaHasText] = useState(false)

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
    }, [textareaHasText, triggerGetAllThemes])

    const onSubmit = handleSubmit(async (data) => {
        console.log(data)
        try {
            await createPost({ content: data.post, themeId: data.selectedTheme }).unwrap()
            setValue("post", "")
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



            )}

            {errors && <ErrorMessage error={errorTheme} />}
            {errors && <ErrorMessage error={errorPost} />}

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
