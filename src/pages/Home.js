import Nav from "../components/Nav"
const Home = () => {
    // true = signin
    // false = signout
    const authToken = false

    const handleClick = () => {
        console.log('You clicked me')
    }

    return (
        <div className="overlay">
        <Nav minimal={false} authToken={authToken}/>
        <div className="home">
            <h1>Swipe Right</h1>
            <button className="primary-button" onClick={handleClick}>
                {/* if authToken(is sign in or true) the button should indicate you signing out. */}
                {authToken ? 'Signout' : 'Create Account' }
            </button>
            
        </div>
        </div>
    )
}

export default Home