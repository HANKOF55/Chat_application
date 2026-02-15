import { Outlet, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/axios";
import ChatPage from "../pages/ChatPage";
import ChatListUser from "../components/ChatListUser";

const ChatLayout = () => {

    const location = useLocation();


    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        getAllUser();
    }, []);

    const getAllUser = async () => {

        setIsLoading(true);
        setError(null);

        try {
            const res = await api.get("/friends/myfriends")
            if (res.data?.data) {
                setUsers(res.data?.data);
            }
        } catch (err) {
            if (err) {
                setError(err.response?.data?.error?.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-full">

            {/* LEFT PANEL Users List */}
            <aside className="w-72 border-r bg-base-100">
                <div className="p-4 border-b font-bold text-lg">
                    My Friends
                </div>

                <div className="overflow-y-auto">
                    {users.map((user) => {
                        const active = location.pathname === `/chat/${user.id}`;

                        return (
                            <ChatListUser active={active} key={user.id} user={user} />

                        );
                    })}
                </div>
            </aside>

            {/* RIGHT PANEL Active Chat */}
            <main className="flex-1 bg-base-200">
                <Outlet />
            </main>

        </div>
    );
};

export default ChatLayout;
