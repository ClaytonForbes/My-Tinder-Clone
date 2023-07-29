import { useState } from "react"


const AuthModal = ({setShowModal, isSignUp}) => {
    const[email,setEmail] = useState(null)
    const[password, setPassword] = useState(null)
    const[confirmPassword, setConfirmPassword] = useState(null)
    const[error, setError] = useState(null)

    console.log(email, password, confirmPassword)
    // const isSignUp = true


    // this is the function for to exit the Auth modal
    const handleClick = () =>{
        setShowModal(false)
    }




//function for the submit 
    const handleSubmit= (e) => {
        e.preventDefault()
        try{
            if(isSignUp && (password !== confirmPassword)){
                setError('Your password need to match check your spelling')
            }
            console.log('make a post request to our database')
        }catch (error){
            console.log(error)
        }
    }
   
    return (
        <div className="auth-modal">
            <div className="close-icon" onClick={handleClick}>ⓧ</div>
            <h2>{isSignUp ? 'Create Account' : 'Log In'}</h2>
            <p>By clicking Login you are agreeing to our terms, and to participate in Clayton's dating App beta. Learn how we process your data in our Privacy Policy or just ask my wife Kate.</p>
            <form onSubmit={handleSubmit}>
                <input
                type="email"
                id="email"
                name="name"
                placeholder="email"
                required={true}
                onChange={(e) => setEmail(e.target.value)}
                />
                 <input
                type="password"
                id="password"
                name="password"
                placeholder="password"
                required={true}
                onChange={(e) => setPassword(e.target.value)}
                />
                 {isSignUp &&<input
                type="password"
                id="password-check"
                name="password-check"
                placeholder="confirm-Password"
                required={true}
                onChange={(e) => setConfirmPassword(e.target.value)}
                />}
                 <input className="secondary-button" type="submit"/>
                 <p>{error}</p>

            </form>
            <hr/>
            <h2>GET THE APP</h2>

            Auth Modal
        </div>
    )
}

export default AuthModal