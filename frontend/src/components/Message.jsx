
const Message = ({ type, username, time, content }) => {


    const formatTime = (time) => {
        return new Date(time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <>

            <div className={`chat ${type}`}>
                <div className="chat-header text-white">
                    {username}
                    <time className="text-xs opacity-50">{formatTime(time)}</time>
                </div>
                <div className="chat-bubble">{content}</div>
            </div>


        </>
    )
}

export default Message;