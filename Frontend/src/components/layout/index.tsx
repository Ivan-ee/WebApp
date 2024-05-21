import { Header } from "../header"
import { Container } from "../container"
import { NavBar } from "../nav-bar"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectIsAuthenticated, selectUser } from "../../features/userSlice"
import { useEffect } from "react"
import { Profile } from "../profile"

export const Layout = () => {
  const isAuth = useSelector(selectIsAuthenticated)
  const user = useSelector(selectUser)
  const navigate = useNavigate()
  // const location = useLocation();

  useEffect(() => {
    if (!isAuth) {
      navigate("/auth")
    }
  }, [])

  // const shouldHideProfile = location.pathname === '/chats' || location.pathname.startsWith('/chats/');

  return (
    <>
      <Header />
      <Container>
        <div className="flex-2 p-4">
          <NavBar />
        </div>
        <div className="flex-1 p-4">
          <Outlet />
        </div>
        <div className="flex-2 p-4">
          <div className="flex-col flex gap-5">
            {!user && <Profile />}
          </div>
        </div>
      </Container>
    </>
  )
}