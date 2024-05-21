import { Spinner } from "@nextui-org/react"
import { Link } from "react-router-dom"
import { Card, CardBody } from "@nextui-org/react"
import { User } from "../../components/user"
import { useGetAllQuery } from "../../app/services/userApi"

export const Chats = () => {
  // const [selectedChat, setSelectedChat] = useState<User | null>(null);

  const { data: chatUsers, isLoading } = useGetAllQuery()

  if (isLoading) {
    return <Spinner />
  }

  return (
    <div>
      {chatUsers && chatUsers?.length > 0 ? (
        <div className="gap-5 flex flex-col">
          {chatUsers.map((user) => (
            <Link to={`/chats/${user.id}`} key={user.id}>
              <Card>
                <CardBody className="block">
                  <User
                    name={user.name ?? ""}
                    avatarUrl={user.avatarUrl ?? ""}
                  />
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <h2>У вас нет доступных чатов</h2>
      )}
    </div>
  )
}