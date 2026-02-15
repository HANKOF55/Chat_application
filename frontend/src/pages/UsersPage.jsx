import { useState, useEffect } from "react";
import { UserPlus } from 'lucide-react';
import api from "../api/axios";

const UsersPage = () => {

    const [users, setUsers] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [requestError, setRequestError] = useState(null)
    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const [successMessage, setsuccessMessage] = useState();

    useEffect(() => {
        getAllUser();
    }, []);

    const getAllUser = async () => {

        setIsLoading(true);
        setError(null);

        try {
            const res = await api.get("/users")
            if (res) {
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


    const sendRequest = async (userId) => {
        try {

            const payload = { receiverId: userId }
            const res = await api.post("/friends/sendRequest", payload);

            if (res?.data) {
                const message = res?.data?.message;
                setsuccessMessage("");
                setsuccessMessage(message)
                setShowNotificationModal(true);
            }

        } catch (err) {

            if (err.response?.data) {
                setRequestError("");
                setRequestError(err.response?.data?.error?.message);
            } else {
                setRequestError("");
                setRequestError("Something went wrong.")
            }
            setShowNotificationModal(true);
        }
    };


    return (
        <>
            {users &&
                (<div className="p-4">


                    <h1 className="text-2xl font-bold mb-4">All Users</h1>

                    {/* Existing Users List */}
                    <div className="space-y-2">
                        {users.map((user) => (
                            <div
                                key={user.id}
                                className="bg-base-100 border rounded-lg px-4 py-3 shadow-sm flex items-center"
                            >
                                <span className="flex-1">{user.username}</span>

                                <button
                                    onClick={() => sendRequest(user.id)}
                                    className="btn btn-ghost btn-sm"
                                >
                                    <UserPlus size={20} />
                                </button>
                            </div>
                        ))}
                    </div>


                    {/* modal for errorMessages and successMessage */}
                    {showNotificationModal && (
                        <dialog className="modal modal-open">
                            <div className="modal-box">
                                <h3 className="font-bold text-lg">
                                    {requestError && <div>{requestError}</div>}
                                    {!requestError && error && <div>{error}</div>}
                                    {!requestError && !error && successMessage && <div>{successMessage}</div>}
                                </h3>
                                <div className="modal-action">
                                    <button
                                        className="btn"
                                        onClick={() => setShowNotificationModal(false)}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </dialog>
                    )}


                </div>)
            }
        </>
    );

}

export default UsersPage;