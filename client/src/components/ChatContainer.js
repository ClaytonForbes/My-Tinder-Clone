import { useState } from "react";

import ChatHeader from "./ChatHeader";
import MatchesDisplay from "./MatchesDisplay";
import ChatDisplay from "./ChatDisplay";

const ChatContainer = ({ user }) => {
  const [clickedUser, setClickedUser] = useState(null);

  const matchCount = user?.matches?.length || 0;

  return (
    <div className="chat-container">

      <ChatHeader user={user} />

      <div className="chat-tabs">

        <button
          className={`option ${!clickedUser ? "active-tab" : ""}`}
          onClick={() => setClickedUser(null)}
        >
          Matches

          {matchCount > 0 && (
            <span className="match-badge">
              {matchCount}
            </span>
          )}
        </button>

        <button
          className={`option ${clickedUser ? "active-tab" : ""}`}
          disabled={!clickedUser}
        >
          Chat
        </button>

      </div>

      <div className="chat-content">

        {!clickedUser ? (
          matchCount > 0 ? (
            <MatchesDisplay
              matches={user.matches}
              setClickedUser={setClickedUser}
            />
          ) : (
            <div className="empty-state">
              <div className="empty-icon">💘</div>

              <h3>No Matches Yet</h3>

              <p>
                Start swiping and you'll see your matches here.
              </p>
            </div>
          )
        ) : (
          <>
            <div className="chat-user-header">

              <button
                className="back-button"
                onClick={() => setClickedUser(null)}
              >
                ←
              </button>

              <div className="chat-user-info">

                <img
                  src={clickedUser.url}
                  alt={clickedUser.first_name}
                />

                <div>
                  <h4>{clickedUser.first_name}</h4>
                  <span>Matched</span>
                </div>

              </div>

            </div>

            <ChatDisplay
              user={user}
              clickedUser={clickedUser}
            />
          </>
        )}

      </div>

    </div>
  );
};

export default ChatContainer;