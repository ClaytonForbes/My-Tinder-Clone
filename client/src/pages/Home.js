import Nav from '../components/Nav';
import AuthModal from "../components/AuthModal";
import { useState } from 'react';
import { useCookies } from "react-cookie";

const Home = () => {
    const [showModal, setShowModal] = useState(false);
    const [isSignUp, setIsSignUp] = useState(true);
    const [cookies, setCookie, removeCookie] = useCookies(['user']);

    const authToken = cookies.AuthToken;

    const handleAuthAction = () => {
        if (authToken) {
            removeCookie('UserId');
            removeCookie('AuthToken');

            // cleaner than full reload
            window.location.href = "/";
            return;
        }

        setShowModal(true);
        setIsSignUp(true);
    };

    return (
        <div className="overlay">
            <Nav
                authToken={authToken}
                minimal={false}
                setShowModal={setShowModal}
                showModal={showModal}
                setIsSignUp={setIsSignUp}
            />

            <div className="home">
                <h1 className="primary-title">
                    Swipe.
                    <br />
                    Match.
                    <br />
                    Connect.
                </h1>

                <button
                    className="primary-button"
                    onClick={handleAuthAction}
                >
                    {authToken ? 'Sign out' : 'Create Account'}
                </button>

                {showModal && (
                    <AuthModal
                        setShowModal={setShowModal}
                        isSignUp={isSignUp}
                        setCookie={setCookie}
                    />
                )}
            </div>
        </div>
    );
};

export default Home;