import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

const MatchesDisplay = ({ matches, setClickedUser }) => {
    const [matchedProfiles, setMatchedProfiles] = useState([]);
    const [loading, setLoading] = useState(true);

    const [cookies] = useCookies(null);
    const userId = cookies.UserId;

    const matchedUserIds = matches?.map(({ user_id }) => user_id) || [];

    const getMatches = async () => {
        try {
            setLoading(true);

            const response = await axios.get(
                "http://localhost:8000/api/users",   // ✅ fixed: was /users (missing /api)
                {
                    params: {
                        userIds: JSON.stringify(matchedUserIds),
                    },
                }
            );

            setMatchedProfiles(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (matchedUserIds.length > 0) {
            getMatches();
        } else {
            setLoading(false);
        }
    }, [matches]);

    // Only show mutual matches (the other person also has us in their matches)
    const filteredMatchedProfiles =
        matchedProfiles?.filter(
            (matchedProfile) =>
                matchedProfile.matches?.some(
                    (profile) => profile.user_id === userId
                )
        ) || [];

    if (loading) {
        return (
            <div className="matches-display">
                <p>Loading matches...</p>
            </div>
        );
    }

    if (filteredMatchedProfiles.length === 0) {
        return (
            <div className="matches-display">
                <div className="empty-state">
                    <div className="empty-icon">💘</div>
                    <h3>No matches yet</h3>
                    <p>Start swiping to find people.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="matches-display">
            {filteredMatchedProfiles.map((match) => (
                <div
                    key={match.user_id}
                    className="match-card"
                    onClick={() => setClickedUser(match)}
                >
                    <div className="match-avatar">
                        <img
                            src={match.url}
                            alt={match.first_name}
                        />
                        <div className="online-indicator"></div>
                    </div>

                    <div className="match-info">
                        <h3>{match.first_name}</h3>
                        <p>Tap to start chatting</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MatchesDisplay;