import { useEffect, useRef } from "react";

const Chat = ({ descendingOrderMessages, userId }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [descendingOrderMessages]);

  const formatTime = (timestamp) => {
    if (!timestamp) return "";

    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!descendingOrderMessages?.length) {
    return (
      <div className="chat-display empty-chat">
        <div className="empty-chat-content">
          <div className="empty-chat-icon">💬</div>
          <h3>Start the conversation</h3>
          <p>Send a message and break the ice.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-display">

      {descendingOrderMessages.map((message, index) => {
        const isOwnMessage =
          message.from_userId === userId;

        return (
          <div
            key={index}
            className={`message-row ${
              isOwnMessage ? "sent" : "received"
            }`}
          >
            {!isOwnMessage && (
              <div className="message-avatar">
                <img
                  src={message.img}
                  alt={message.name}
                />
              </div>
            )}

            <div className="message-content">

              <div
                className={`message-bubble ${
                  isOwnMessage
                    ? "sent-bubble"
                    : "received-bubble"
                }`}
              >
                {message.message}
              </div>

              <span className="message-time">
                {formatTime(message.timestamp)}
              </span>

            </div>

          </div>
        );
      })}

      <div ref={messagesEndRef} />

    </div>
  );
};

export default Chat;