import { Check, X } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../api/axios";

const RequestsPage = () => {

    const [requests, setRequests] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [requestError, setRequestError] = useState(null)
    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const [successMessage, setsuccessMessage] = useState();

    useEffect(() => {

        fetchAllRequests();

    }, [])

    const fetchAllRequests = async () => {

        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const res = await api.get("/friends/myrequests");
            if (res.data?.success) {
                setSuccess(res.data?.success);
            }
            setRequests(res.data?.data);
        } catch (err) {
            if (err?.response?.error) {
                setError(err?.response?.error?.message || "Failed to fetch friend requests.");
            }
        } finally {
            setIsLoading(false);
        }
    }

    const acceptRequest = async (userId) => {
        try {

            const payload = { receiverId: userId }

            const res = await api.post("/friends/accept", payload);

            if (res?.data) {
                const message = res?.data?.message;
                setsuccessMessage(message)
                setShowNotificationModal(true);
                fetchAllRequests();
            }

        } catch (err) {

            if (err.response?.data) {
                setRequestError(err.response?.data?.error?.message);
            } else {
                setRequestError("Something went wrong.")
            }
            setShowNotificationModal(true);
        }
    };

    const rejectRequest = async (userId) => {
        try {

            const payload = { receiverId: userId }
            console.log(payload)
            const res = await api.post("/friends/reject", payload);

            if (res?.data) {
                const message = res?.data?.message;
                setsuccessMessage(message)
                setShowNotificationModal(true);
                fetchAllRequests();
            }

        } catch (err) {

            if (err.response?.data) {
                setRequestError(err.response?.data?.error?.message);
            } else {
                setRequestError("Something went wrong.")
            }
            setShowNotificationModal(true);
        }
    };

    if (isLoading) {
        return (
            <section className=" mx-auto felx justify-center items-center">
                <span className="loading loading-spinner loading-xl"></span>
            </section>
        )
    }

    if (error) {
        return (<>
            <div role="alert" className="alert alert-error">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
            </div>
        </>)
    }

    if (!requests || requests.length === 0) {
        return (
            <section className="p-3 flex items-center justify-center h-full">

                <div role="alert" className="alert alert-success">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Currently you have no requests!</span>
                </div>
            </section>
        )
    }

    if (requests) {
        return (
            <>
                <div className="p-4">
                    <h1 className="text-2xl font-bold mb-4">Requests</h1>

                    <div className="space-y-2">
                        {requests.map((req) => (
                            <div
                                key={req.id}
                                className="bg-base-100 border rounded-lg px-4 py-3 shadow-sm flex items-center"
                            >
                                <span className="flex-1">{req.username}</span>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => acceptRequest(req.id)}
                                        className="btn btn-success btn-sm"
                                    >
                                        <Check size={18} />
                                    </button>

                                    <button
                                        onClick={() => rejectRequest(req.id)}
                                        className="btn btn-error btn-sm"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </>
        );
    }

}


export default RequestsPage;
