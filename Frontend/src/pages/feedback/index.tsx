import type React from "react"
import { Input } from "../../components/input/input"
import { Button, Card, CardBody, CardFooter, Textarea } from "@nextui-org/react"
import { Controller, useForm } from "react-hook-form"
import { ErrorMessage } from "../../components/error-message"

type FormData = {
  name: string;
  nickname: string;
  message: string;
};

export const Feedback: React.FC = () => {

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<FormData>({
    mode: "onChange",
    reValidateMode: "onBlur",
    defaultValues: {
      name: "",
      nickname: "",
      message: ""
    }
  })

  const error = errors?.message?.message as string

  const handleTelegramRedirect = (data: FormData) => {
    const telegramUsername = "smirnowwwivan";
    const { name, nickname, message } = data;
    const text = `Name: ${name} Email: ${nickname} Message: ${message}`;
    const encodedText = encodeURIComponent(text);
    const url = `https://t.me/${telegramUsername}?text=${encodedText}`;
    window.open(url, "_blank");
  };

  return (

    <div className="flex flex-col items-center justify-center">
      <Card className="max-w-md w-full">
        <form onSubmit={handleSubmit(handleTelegramRedirect)}>
          <CardBody className="space-y-4">
            <h2 className="text-center text-2xl font-bold">Свяжитесь с нами</h2>
            <Input
              control={control}
              name="name"
              label="Имя"
              type="text"
              required="Обязательное поле"
            />
            <Input
              control={control}
              name="nickname"
              label="Ник в телеграмме"
              type="text"
              required="Обязательное поле"
            />

            <Controller
              name="message"
              control={control}
              defaultValue=""
              rules={{
                required: "Обязательное поле"
              }}
              render={({ field }) => (
                <Textarea
                  {...field}
                  labelPlacement="outside"
                  placeholder="О чем думайте?"
                  className="mb-5"
                />
              )}
            />
            {errors && <ErrorMessage error={error} />}
          </CardBody>
          <CardFooter className="flex justify-center space-x-4">
            <Button color="primary" variant="flat" type="submit">
              Отправить в Telegram
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
