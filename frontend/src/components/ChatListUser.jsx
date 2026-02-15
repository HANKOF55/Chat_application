import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ChatListUser = ({ user, active }) => {

    const onlineUsers = useSelector(store => store.socket.onlineUsers)
    const isOnline = onlineUsers.includes(user)

    return (
        <>
            <Link
                key={user.id}
                to={`/chat/${user.id}`}
                className={` px-4 py-3 border-b-1 flex items-center gap-5 border-gray-700 cursor-pointer transition ${active
                    ? "bg-primary text-primary-content"
                    : "hover:bg-base-200"
                    }`}
            >
                <div className={`avatar avatar-placeholder ${isOnline ? "avatar-online" : ""}`}>
                    <div className="bg-neutral text-neutral-content w-12 rounded-full">
                        <span>{user.username[0]}</span>
                    </div>
                </div>
                <h3>
                    {user.username}
                </h3>
            </Link>

        </>
    )
}

export default ChatListUser;