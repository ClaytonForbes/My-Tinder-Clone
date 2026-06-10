import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'

const AuthModal = ({ setShowModal, isSignUp }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const [, setCookie] = useCookies(['user'])
    const navigate = useNavigate()

    const handleClick = () => {
        setShowModal(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        setError('')

        if (isSignUp && password !== confirmPassword) {
            setError('Passwords need to match!')
            return
        }

        try {
            setLoading(true)

            const response = await axios.post(
                `http://localhost:8000/${isSignUp ? 'signup' : 'login'}`,
                {
                    email,
                    password
                }
            )

            const cookieOptions = {
                path: '/',
                maxAge: 60 * 60 * 24 * 7 // 7 days
            }

            setCookie('Email', response.data.email, cookieOptions)
            setCookie('AuthToken', response.data.token, cookieOptions)
            setCookie('UserId', response.data.userId, cookieOptions)

            if (isSignUp) {
                navigate('/onboarding')
            } else {
                navigate('/dashboard')
            }

        } catch (err) {
            console.error(err)

            setError(
                err?.response?.data ||
                err?.response?.data?.message ||
                'Authentication failed'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-modal">
            <div
                className="close-icon"
                onClick={handleClick}
            >
                ⓧ
            </div>

            <h2>
                {isSignUp ? 'CREATE ACCOUNT' : 'LOG IN'}
            </h2>

            <p>
                By clicking {isSignUp ? 'Create Account' : 'Log In'},
                you agree to our Terms of Service and acknowledge
                that you have read our Privacy Policy.
            </p>

            <form onSubmit={handleSubmit}>

                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email Address"
                    required
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                />

                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                />

                {isSignUp && (
                    <input
                        type="password"
                        id="confirm-password"
                        name="confirm-password"
                        placeholder="Confirm Password"
                        required
                        value={confirmPassword}
                        onChange={(e) =>
                            setConfirmPassword(e.target.value)
                        }
                    />
                )}

                <button
                    type="submit"
                    className="primary-button"
                    disabled={loading}
                >
                    {loading
                        ? 'Please Wait...'
                        : isSignUp
                            ? 'Create Account'
                            : 'Log In'}
                </button>

                {error && (
                    <p
                        style={{
                            color: '#ff4458',
                            marginTop: '15px',
                            fontWeight: '600'
                        }}
                    >
                        {error}
                    </p>
                )}

            </form>

            <hr />

            <h2>GET THE APP</h2>

            <p>
                Available soon on iOS and Android.
            </p>

        </div>
    )
}

export default AuthModal