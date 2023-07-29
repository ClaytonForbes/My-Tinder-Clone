import Nav from "../components/Nav"
import AuthModal from "../components/AuthModal"
import {useState}from 'react'
const Home = () => {
    const [showModal, setShowModal] = useState(false)
    // true = signin
    // false = signout
    const authToken = false
    const[isSignUp, setIsSignUp] = useState(true)

    const handleClick = () => {
        console.log('You clicked me')
        setShowModal(true)
        setIsSignUp(true)
    }

    return (
        <div className="overlay">
        <Nav minimal={false} 
        setShowModal={setShowModal}
        showModal={showModal}
        setIsSignUp={setIsSignUp} />

        <div className="home">
            <h1 className="primary-title">Swipe Right</h1>
            <button className="primary-button" onClick={handleClick}>
                {/* if authToken(is sign in or true) the button should indicate you signing out. */}
                {authToken ? 'Signout' : 'Create Account' }
            </button>
            {showModal && (
                <AuthModal setShowModal={setShowModal}  isSignUp={isSignUp}/>
            )}
            
        </div>
        </div>
    )
}

export default Home