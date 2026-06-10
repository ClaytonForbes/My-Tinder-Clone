import { useState } from "react";
import axios from "axios";
import socket from "../socket";

const ChatInput = ({
    user,
    clickedUser,
    getUsersMessages,
    getClickedUsersMessages
}) => {

    const [textArea, setTextArea] = useState("");

    const userId = user?.user_id;
    const clickedUserId = clickedUser?.user_id;

    const addMessage = async () => {

        if (!textArea.trim()) return;

        const message = {
            timestamp: new Date().toISOString(),
            from_userId: userId,
            to_userId: clickedUserId,
            message: textArea
        };

        try {

            // save to database
            await axios.post(
                "http://localhost:8000/api/messages",
                message
            );

            // realtime send
            socket.emit("send_message", {
                fromUserId: userId,
                toUserId: clickedUserId,
                message: textArea
            });

            await getUsersMessages();
            await getClickedUsersMessages();

            setTextArea("");

        } catch (error) {
            console.log(error);
        }
    };

    const handleKeyDown = (e) => {

        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            addMessage();
        }

    };

    return (
        <div className="chat-input">

            <textarea
                value={textArea}
                placeholder="Type a message..."
                onChange={(e) => setTextArea(e.target.value)}
                onKeyDown={handleKeyDown}
            />

            <button
                className="send-button"
                onClick={addMessage}
            >
                Send
            </button>

        </div>
    );
};

export default ChatInput;