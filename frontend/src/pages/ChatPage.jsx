import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/axios";
import Messages from "../components/Messages";
import { useSelector } from "react-redux";


const ChatPage = () => {

    const socket = useSelector((store) => store.socket.socket);
    const currentUser = useSelector((state) => state.auth.user);

    const { userId } = useParams();

    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [receiver, setReceiver] = useState(null);


    // Fetch messages when userId changes
    useEffect(() => {
        if (userId) {
            getUserMessages(userId);
        }
    }, [userId,]);

    // Listen for new messages
    useEffect(() => {
        if (!socket) {
            console.log("Socket not connected");
            return;
        }

        const handleNewMessage = (newMessage) => {
            console.log("New message received:", newMessage);

            const userIdInt = parseInt(userId);

            if (
                (newMessage.senderId === userIdInt && newMessage.receiverId === currentUser.id) ||
                (newMessage.senderId === currentUser.id && newMessage.receiverId === userIdInt)
            ) {
                setMessages((prev) => [...prev, newMessage]);
            }
        };

        socket.on("newMessage", handleNewMessage);

        return () => {
            socket.off("newMessage", handleNewMessage);
        };
    }, [socket, userId, currentUser?.id]);

    const getUserMessages = async (userId) => {
        if (!userId) return;

        try {
            const res = await api.get(`/chat/history/${userId}`);
            if (res?.data?.success) {
                console.log("Fetched messages:", res.data?.data?.messages);
                const fetchedMessages = res.data?.data?.messages;

                setMessages(fetchedMessages);

                // Store receiver info from first message
                if (fetchedMessages.length > 0) {
                    const firstMessage = fetchedMessages[0];
                    const receiverData = firstMessage.sender.id === currentUser.id
                        ? firstMessage.receiver
                        : firstMessage.sender;
                    setReceiver(receiverData);
                }
            }
        } catch (err) {
            console.error("Error fetching messages:", err);
        }
    };

    // Build complete message object with sender/receiver
    const sendMessage = async (userId) => {
        if (!text.trim()) return;

        const userIdInt = parseInt(userId);

        try {
            const payload = { content: text };
            const res = await api.post(`/chat/sendmessage/${userId}`, payload);

            if (res?.data?.success) {
                console.log("Message sent:", res.data.data);

                // Build complete message object with sender/receiver
                const messageWithDetails = {
                    ...res.data.data,
                    sender: {
                        id: currentUser.id,
                        username: currentUser.username
                    },
                    receiver: receiver || {
                        id: userIdInt,
                        username: `User ${userIdInt}` // Fallback
                    }
                };

                setMessages((prev) => [...prev, messageWithDetails]);
            }
        } catch (err) {
            console.error("Error sending message:", err);
        } finally {
            setText("");
        }
    };


    return (
        <div className="h-full flex flex-col">

            {/* Header */}
            <div className="p-4 border-b bg-base-100 font-semibold">
                Chat with User {userId}
            </div>

            {/* Messages */}
            <Messages allMessages={messages} />

            {/* Input */}
            <div className="p-3 border-t bg-base-100 flex gap-2 mb-3">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="input input-bordered w-full"
                />
                <button onClick={() => sendMessage(userId)} className="btn btn-primary">Send</button>
            </div>

        </div>
    );
};

export default ChatPage;
