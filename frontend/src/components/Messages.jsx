import Message from "./Message";
import { useSelector } from "react-redux";
import { useEffect, useRef } from "react";

const Messages = ({ allMessages }) => {

    const user = useSelector((state) => state.auth.user);
    const bottomRef = useRef(null);

    // Auto scroll to latest message
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [allMessages]);

    const sortedMessages = [...allMessages].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );


    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {sortedMessages.map((message) => (
                <Message
                    key={message.id}
                    time={message.createdAt}
                    content={message.content}
                    username={
                        message?.senderId === user?.id ? user?.username :
                            message?.sender?.username
                    }
                    type={
                        message.senderId === user?.id
                            ? "chat-end"
                            : "chat-start"
                    }
                />
            ))}

            {/* Invisible anchor for auto-scroll */}
            <div ref={bottomRef} />
        </div>
    );
};

export default Messages;
