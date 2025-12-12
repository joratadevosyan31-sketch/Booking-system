import LoginMessage from "./LoginMessage";
import { useState, useEffect } from "react";
import {
    auth,
    signInWithPhoneNumber,
    setupRecaptcha,
    clearRecaptcha
} from "../../../firebase";

const LoginForm = ({ setFormMode, setConfirmationResult, setPhoneNumber: setParentPhoneNumber }) => {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [localPhoneNumber, setLocalPhoneNumber] = useState("+374 ");

    useEffect(() => {
        if (!document.getElementById("recaptcha-container")) {
            const container = document.createElement("div");
            container.id = "recaptcha-container";
            container.style.display = "none";
            document.body.appendChild(container);
        }

        return () => {
            clearRecaptcha();
        };
    }, []);

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        setLocalPhoneNumber(value);

        if (value.startsWith("+374") && value.length === 4) {
            setLocalPhoneNumber(value + " ");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        let phone = localPhoneNumber.trim();

        if (!phone || phone === "+374") {
            setError("Please enter a valid phone number");
            setLoading(false);
            return;
        }

        if (!phone.startsWith('+')) {
            phone = '+' + phone.replace(/^\+/, '');
        }

        const cleanPhone = phone.replace(/\s/g, '');

        if (cleanPhone.startsWith('+374')) {

            const digitsAfterCode = cleanPhone.substring(4);
            if (digitsAfterCode.length !== 8 || !/^\d{8}$/.test(digitsAfterCode)) {
                setError("Please enter a valid 8-digit Armenian number after +374");
                setLoading(false);
                return;
            }
        }

        try {
            // Setup reCAPTCHA verifier
            const recaptchaVerifier = setupRecaptcha();

            console.log("Sending SMS to:", cleanPhone);

            // Send SMS verification code via Firebase
            const confirmation = await signInWithPhoneNumber(auth, cleanPhone, recaptchaVerifier);

            console.log("SMS sent successfully!", confirmation);

            // Store phone number in parent component
            if (setParentPhoneNumber) {
                setParentPhoneNumber(phone);
            }

            // Store confirmation result and switch to confirm mode
            setConfirmationResult(confirmation);
            setFormMode("confirm");

            // Store phone number for display
            localStorage.setItem("tempPhoneNumber", phone);

        } catch (err) {
            console.error("Firebase error:", err.code, err.message);

            let errorMessage = "Failed to send verification code. Please try again.";

            if (err.code) {
                switch (err.code) {
                    case 'auth/invalid-phone-number':
                        errorMessage = "Invalid phone number format. Please use: +374 XX XXXXXX";
                        break;
                    case 'auth/too-many-requests':
                        errorMessage = "Too many requests. Please try again later.";
                        break;
                    case 'auth/quota-exceeded':
                        errorMessage = "SMS quota exceeded. Please try again later.";
                        break;
                    case 'auth/operation-not-allowed':
                        errorMessage = "Phone authentication is not enabled. Please enable it in Firebase Console.";
                        break;
                    case 'auth/captcha-check-failed':
                        errorMessage = "Security check failed. Please refresh the page.";
                        break;
                    case 'auth/billing-not-enabled':
                        errorMessage = "Billing is not enabled. Please upgrade to Firebase Blaze plan to use phone authentication.";
                        break;
                    default:
                        errorMessage = `Error: ${err.code}`;
                }
            } else if (err.message) {
                errorMessage = err.message;
            }

            setError(errorMessage);
            clearRecaptcha();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex flex-col gap-4'>
            <p className="w-[400px] text-center text-[18px] text-gray-600">
                Enter your phone number to receive a verification code via SMS
            </p>

            {/* Hidden reCAPTCHA container */}
            <div id="recaptcha-container" style={{ display: 'none' }}></div>

            <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center gap-4"
            >
                <div className="relative">
                    <input
                        type="tel"
                        value={localPhoneNumber}
                        onChange={handlePhoneChange}
                        name="phoneNumber"
                        placeholder="+374 XX XXXXXX"
                        className="border-[2px] border-black rounded-[12px] text-[20px] py-3 px-5 w-[300px]"
                        disabled={loading}
                        autoComplete="tel"
                        autoFocus
                    />
                    <div className="text-sm text-gray-500 mt-1 text-center">
                        Example: +374 99 123456
                    </div>
                </div>

                <LoginMessage error={error} />

                <button
                    type="submit"
                    disabled={loading}
                    className="px-7 py-3 text-[20px] bg-black text-white rounded-[25px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors duration-200 min-w-[200px]"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending SMS...
                        </span>
                    ) : "Send Verification Code"}
                </button>

                <div className="text-sm text-gray-500 text-center mt-2">
                    Standard SMS rates may apply
                </div>
            </form>
        </div>
    );
};

export default LoginForm;