import { Button, Link, Card, CardBody, CardFooter } from "@nextui-org/react"
import { useNavigate } from "react-router-dom"

export default function NotFound() {
  const navigate = useNavigate()

  const handleGoBack = () => {
    navigate("/")
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Card className="max-w-md">
        <CardBody>
          <p>
            404 - Страница не найдена
          </p>
        </CardBody>
        <CardFooter className="flex justify-center">
          <Button onPress={handleGoBack} color="primary" variant="flat">
            Вернуться на главную
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}