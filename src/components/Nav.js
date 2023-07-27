import whiteLogo from '../images/tinder_logo_white.png'
import colorLogo from '../images/color-logo-tinder.png'
const Nav = ({minimal, authToken}) => {
    // const minimal = true 

    return (
        <nav>
            <div className="logo-container">
                <img className="logo" alt='Tinder-logo-sign' src={minimal ? colorLogo : whiteLogo}/>
            </div>
            {!authToken && <button className="nav-button">Log In</button>}
        </nav>
    )
}

export default Nav