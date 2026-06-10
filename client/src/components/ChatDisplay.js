import Chat from "./Chat";
import ChatInput from "./ChatInput";
import socket from "../socket";

import axios from "axios";
import { useEffect, useMemo, useState } from "react";

const ChatDisplay = ({ user, clickedUser }) => {
  const [usersMessages, setUsersMessages] = useState([]);
  const [clickedUsersMessages, setClickedUsersMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = user?.user_id;
  const clickedUserId = clickedUser?.user_id;

  const getUsersMessages = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/messages",
        {
          params: {
            userId,
            correspondingUserId: clickedUserId,
          },
        }
      );

      setUsersMessages(response.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const getClickedUsersMessages = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/messages",
        {
          params: {
            userId: clickedUserId,
            correspondingUserId: userId,
          },
        }
      );

      setClickedUsersMessages(response.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const loadMessages = async () => {
    try {
      setLoading(true);

      await Promise.all([
        getUsersMessages(),
        getClickedUsersMessages(),
      ]);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && clickedUserId) {
      loadMessages();
    }
  }, [userId, clickedUserId]);

  useEffect(() => {
    const handleIncomingMessage = (data) => {

      if (
        data.fromUserId === clickedUserId ||
        data.toUserId === clickedUserId
      ) {
        getUsersMessages();
        getClickedUsersMessages();
      }
    };

    socket.on(
      "receive_message",
      handleIncomingMessage
    );

    return () => {
      socket.off(
        "receive_message",
        handleIncomingMessage
      );
    };
  }, [clickedUserId]);

  const messages = useMemo(() => {
    const mergedMessages = [];

    usersMessages.forEach((message) => {
      mergedMessages.push({
        from_userId: userId,
        name: user?.first_name,
        img: user?.url,
        message: message.message,
        timestamp: message.timestamp,
      });
    });

    clickedUsersMessages.forEach((message) => {
      mergedMessages.push({
        from_userId: clickedUserId,
        name: clickedUser?.first_name,
        img: clickedUser?.url,
        message: message.message,
        timestamp: message.timestamp,
      });
    });

    return mergedMessages.sort(
      (a, b) =>
        new Date(a.timestamp) -
        new Date(b.timestamp)
    );
  }, [
    usersMessages,
    clickedUsersMessages,
    user,
    clickedUser,
    userId,
    clickedUserId,
  ]);

  if (loading) {
    return (
      <div className="chat-loading">
        <div className="loading-spinner"></div>
        <p>Loading conversation...</p>
      </div>
    );
  }

  return (
    <div className="chat-display-wrapper">

      <div className="chat-user-header">

        <div className="chat-user-profile">

          <img
            src={clickedUser?.url}
            alt={clickedUser?.first_name}
          />

          <div>

            <h3>{clickedUser?.first_name}</h3>

            <span className="chat-status">
              🟢 Active Now
            </span>

          </div>

        </div>

      </div>

      <Chat
        descendingOrderMessages={messages}
        userId={userId}
      />

      <ChatInput
        user={user}
        clickedUser={clickedUser}
        getUsersMessages={getUsersMessages}
        getClickedUsersMessages={
          getClickedUsersMessages
        }
      />

    </div>
  );
};

export default ChatDisplay;