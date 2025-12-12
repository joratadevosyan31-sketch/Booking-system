import { useEffect, useState } from "react"
import Login from "../../../Modal/LoginModal/Login"

const Navigation = () => {

    const [IsLoginOpen, setIsLoginOpen] = useState(false)
    const [isLoged, setIsLoged] = useState(false)

    useEffect(() => {
        if (IsLoginOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "auto"
        }

        return () => {
            document.body.style.overflow = "auto"
        }
    }, [IsLoginOpen])

    useEffect(() => {
        const isAuth = localStorage.getItem("isAuthenticated")
        const serc = localStorage.getItem("_grecaptcha")
        if (isAuth && serc) {
            setIsLoged(true)
        }
    }, [])

    const handleSagnOut = () => {

    }

    return (
        <>
            <nav className="border-[1px] border-gray py-3 z-50 sticky top-0 bg-white">
                <div className="container">
                    <div className="flex items-center justify-between">
                        <ul className="flex items-center gap-4">
                            <li>
                                <a href="#services" className="text-[24px] font-medium">Services</a>
                            </li>
                            <li>
                                <a href="#team" className="text-[24px] font-medium ">Team</a>
                            </li>
                            <li>
                                <a href="#about" className="text-[24px] font-medium ">About</a>
                            </li>
                        </ul>
                        <div>
                            {
                                isLoged ? (
                                    <button
                                        type="button"
                                        className="text-[24px] text-blue-700 font-semibold p-3 rounded-[25px]"
                                    >
                                        Sign out
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setIsLoginOpen(true)}
                                        type="button"
                                        className="text-[24px] text-blue-700 font-semibold p-3 rounded-[25px]"
                                    >
                                        Sign up
                                    </button>
                                )
                            }

                        </div>
                    </div>
                </div>
            </nav >

            {IsLoginOpen && <Login setIsLoginOpen={setIsLoginOpen} />
            }
        </>

    )
}

export default Navigation