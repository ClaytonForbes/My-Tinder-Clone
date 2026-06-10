import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

import ChatContainer from "../components/ChatContainer";
import socket from "../socket";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [potentialMatches, setPotentialMatches] = useState([]);
  const [cardIndex, setCardIndex] = useState(0);

  const [swipeOverlay, setSwipeOverlay] = useState(null);
  const [lastDirection, setLastDirection] = useState("");
  const [showMatch, setShowMatch] = useState(false);

  const [cookies] = useCookies(["user"]);
  const navigate = useNavigate();

  const userId = cookies.UserId;

  // ---------------- AUTH GUARD ----------------

  useEffect(() => {
    if (!cookies.AuthToken) {
      navigate("/");
    }
  }, [cookies.AuthToken, navigate]);

  // ---------------- SOCKET ----------------

  useEffect(() => {
    if (userId) {
      socket.emit("join", userId);
    }
  }, [userId]);

  // ---------------- GET USER ----------------

  const getUser = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/users/${userId}`
      );

      setUser(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // ---------------- GET FEED ----------------

  const getPotentialMatches = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/swipes/potential/${userId}`
      );

      setPotentialMatches(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // ---------------- INITIAL LOAD ----------------

  useEffect(() => {
    if (!userId) return;

    getUser();
    getPotentialMatches();
  }, [userId]);

  // ---------------- SWIPE ----------------

  const swipeUser = async (direction, targetUserId) => {
    try {
      await axios.post("http://localhost:8000/api/swipes", {
        fromUserId: userId,
        toUserId: targetUserId,
        direction,
      });

      if (direction === "right") {
        const matchResponse = await axios.post(
          "http://localhost:8000/api/matches",
          {
            userId,
            matchedUserId: targetUserId,
          }
        );

        if (matchResponse.data?.isMatch) {
          setShowMatch(true);

          setTimeout(() => {
            setShowMatch(false);
          }, 3000);
        }
      }

      await getUser();

      setCardIndex((prev) => prev + 1);

      setLastDirection(direction);
      setSwipeOverlay(null);
    } catch (error) {
      console.log(error);
    }
  };

  // ---------------- CURRENT CARDS ----------------

  const visibleCards = potentialMatches
    .slice(cardIndex, cardIndex + 3)
    .reverse();

  return (
    <div className="dashboard">
      {user && <ChatContainer user={user} />}

      <div className="swipe-container">

        {showMatch && (
          <div className="match-popup">
            💘 It's a Match!
          </div>
        )}

        <div className="card-stack">

        <motion.div className="cards">

            {visibleCards.map((currentCard, index) => {

              const isTopCard =
                currentCard.user_id ===
                potentialMatches[cardIndex]?.user_id;

              return (
                <motion.div
                  key={currentCard.user_id}
                  className="swipe"
                  drag={isTopCard ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.8}
                  whileTap={{ scale: 1.03 }}
                  initial={{
                    scale: 0.95,
                    opacity: 0,
                  }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                  }}
                  exit={{
                    x: 600,
                    opacity: 0,
                  }}
                  onDrag={(e, info) => {
                    if (!isTopCard) return;

                    if (info.offset.x > 80) {
                      setSwipeOverlay("right");
                    } else if (info.offset.x < -80) {
                      setSwipeOverlay("left");
                    } else {
                      setSwipeOverlay(null);
                    }
                  }}
                  onDragEnd={(e, info) => {
                    if (!isTopCard) return;

                    if (info.offset.x > 150) {
                      swipeUser("right", currentCard.user_id);
                    } else if (info.offset.x < -150) {
                      swipeUser("left", currentCard.user_id);
                    } else {
                      setSwipeOverlay(null);
                    }
                  }}
                  style={{
                    zIndex: 100 - index,
                  }}
                >
                  <div
                    className="card"
                    style={{
                      backgroundImage: `url(${currentCard.url})`,
                      transform: `scale(${1 - index * 0.04})
                                  translateY(${index * 12}px)`
                    }}
                  >
                    {swipeOverlay &&
                      isTopCard && (
                        <div
                          className={`overlay-label ${swipeOverlay}`}
                        >
                          {swipeOverlay === "right"
                            ? "LIKE ❤️"
                            : "NOPE ❌"}
                        </div>
                      )}

                    <div className="card-info">

                      <h2>
                        {currentCard.first_name}
                        {currentCard.dob_year &&
                          `, ${
                            new Date().getFullYear() -
                            currentCard.dob_year
                          }`}
                      </h2>

                      <p>
                        {currentCard.about ||
                          "No bio yet"}
                      </p>

                    </div>
                  </div>
                </motion.div>
              );
            })}

          </motion.div>
        </div>

        <div className="action-buttons">

          <button
            className="action-btn nope-btn"
            onClick={() => {
              const current =
                potentialMatches[cardIndex];

              if (current) {
                swipeUser(
                  "left",
                  current.user_id
                );
              }
            }}
          >
            ✕
          </button>

          <button
            className="action-btn like-btn"
            onClick={() => {
              const current =
                potentialMatches[cardIndex];

              if (current) {
                swipeUser(
                  "right",
                  current.user_id
                );
              }
            }}
          >
            ♥
          </button>

        </div>

        {lastDirection && (
          <div className="swipe-info">
            You swiped {lastDirection}
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;