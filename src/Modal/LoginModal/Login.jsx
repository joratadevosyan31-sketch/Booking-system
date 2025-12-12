import LoginForm from './Components/LoginForm'
import CloseIcon from '../../Components/icons/CloseIcon'
import ConfirmLogin from './Components/ConfirmLogin'
import { useState } from 'react'

const Login = ({ setIsLoginOpen }) => {
    const [formMode, setFormMode] = useState("login")
    const [confirmationResult, setConfirmationResult] = useState(null)
    const [phoneNumber, setPhoneNumber] = useState("")

    const handleCloseLogin = (e) => {
        if (e.target === e.currentTarget) {
            setIsLoginOpen(false)
        }
    }

    const handleAuthSuccess = (user) => {
        // console.log("User authenticated successfully:", user)
        setIsLoginOpen(false)

        localStorage.setItem("user", JSON.stringify(user))
        localStorage.setItem("isAuthenticated", "true")

        window.location.reload()
    }

    const handleBackToLogin = () => {
        setFormMode("login")
        setConfirmationResult(null)
    }

    return (
        <div
            onClick={handleCloseLogin}
            className="flex items-center justify-center fixed inset-0 bottom-0 bg-[#00000033] z-[9999]"
        >
            <div className="relative modal-anim">
                <div className="w-[600px] flex flex-col items-center gap-6 border-[2px] border-gray p-6 rounded-[12px] bg-white">
                    <h2 className="text-[36px]">Paragon for users</h2>

                    {formMode === "login" &&
                        <LoginForm
                            setFormMode={setFormMode}
                            setConfirmationResult={setConfirmationResult}
                            setPhoneNumber={setPhoneNumber}
                        />
                    }

                    {formMode === "confirm" &&
                        <ConfirmLogin
                            confirmationResult={confirmationResult}
                            phoneNumber={phoneNumber}
                            onSuccess={handleAuthSuccess}
                            onBack={handleBackToLogin}
                        />
                    }
                </div>
                <button
                    onClick={() => setIsLoginOpen(false)}
                    type="button"
                    className="absolute top-3 right-3 p-2 border-[1px] border-gray rounded-full hover:bg-gray-100 transition-colors"
                >
                    <CloseIcon />
                </button>
            </div>
        </div>
    )
}

export default Login