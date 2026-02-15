import { useState, useEffect } from "react";
import api from "../api/axios";

const FriendsPage = () => {

    const [friends, setFriends] = useState(null);
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
            if (res) {
                setFriends(res.data?.data);
            }
        } catch (err) {
            if (err) {
                setError(err.response?.data?.error?.message);
            }
        } finally {
            setIsLoading(false);
        }
    };


    if (friends) {
        return (
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Friends</h1>

                <div className="space-y-2">
                    {friends.map((friend) => (
                        <div
                            key={friend.id}
                            className="bg-base-100 border rounded-lg px-4 py-3 shadow-sm hover:cursor-pointer hover:bg-base-200"
                        >
                            {friend.username}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

}


export default FriendsPage;