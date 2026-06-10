import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const ChatHeader = ({ user }) => {
    const [cookies, setCookie, removeCookie] = useCookies([
        "UserId",
        "AuthToken",
        "Email",
    ]);

    const navigate = useNavigate();

    const logout = () => {
        removeCookie("UserId");
        removeCookie("AuthToken");
        removeCookie("Email");

        navigate("/");
        window.location.reload();
    };

    return (
        <div className="chat-container-header">

            <div className="profile">

                <div className="profile-avatar">
                    <img
                        src={user?.url}
                        alt={user?.first_name}
                    />

                    <span className="online-dot"></span>
                </div>

                <div className="profile-details">
                    <h3>{user?.first_name}</h3>
                    <p>Online</p>
                </div>

            </div>

            <button
                className="logout-button"
                onClick={logout}
            >
                Logout
            </button>

        </div>
    );
};

export default ChatHeader;