import {NavButton} from "../nav-button";
import {BsPostcard} from "react-icons/bs";
import {FiUsers} from "react-icons/fi";
import {FaUsers} from "react-icons/fa";
import { IoChatboxOutline } from "react-icons/io5";

export const NavBar = () => {
    return (
        <nav>
            <ul className='flex flex-col gap-5'>
                <li>
                    <NavButton icon={<BsPostcard />} href='/'>
                        Посты
                    </NavButton>
                </li>
                <li>
                    <NavButton icon={<IoChatboxOutline />} href='chats'>
                        Чаты
                    </NavButton>
                </li>
                <li>
                    <NavButton icon={<FiUsers />} href='following'>
                        Подписки
                    </NavButton>
                </li>
                <li>
                    <NavButton icon={<FaUsers />} href='followers'>
                        Подписчики
                    </NavButton>
                </li>
            </ul>
        </nav>
    )
}