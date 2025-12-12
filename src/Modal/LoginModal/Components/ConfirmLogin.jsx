import { useState, useEffect, useRef } from "react";
import { verifySMSCode } from "../../../firebase";
import { useDispatch } from "react-redux";

const ConfirmLogin = ({ confirmationResult, phoneNumber, onSuccess, onBack }) => {

    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [resendDisabled, setResendDisabled] = useState(false);
    const [resendTimer, setResendTimer] = useState(60);
    const inputRefs = useRef([]);

    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }

        const storedPhone = localStorage.getItem("tempPhoneNumber");
        if (!phoneNumber && storedPhone) {
            phoneNumber = storedPhone;
        }
    }, []);

    useEffect(() => {
        let timer;
        if (resendDisabled && resendTimer > 0) {
            timer = setInterval(() => {
                setResendTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setResendDisabled(false);
                        return 60;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [resendDisabled, resendTimer]);

    const handleCodeChange = (index, value) => {
        if (value.length <= 1 && /^\d*$/.test(value)) {
            const newCode = [...code];
            newCode[index] = value;
            setCode(newCode);

            if (value && index < 5) {
                inputRefs.current[index + 1]?.focus();
            }

            if (index === 5 && value) {
                handleSubmit();
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            const newCode = [...code];
            newCode[index - 1] = "";
            setCode(newCode);
            inputRefs.current[index - 1]?.focus();
        }

        if (e.key === "ArrowLeft" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        if (e.key === "ArrowRight" && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData("text").slice(0, 6);
        if (/^\d{6}$/.test(pasteData)) {
            const newCode = pasteData.split("");
            setCode(newCode);

            setTimeout(() => {
                inputRefs.current[5]?.focus();
            }, 0);
        }
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        const verificationCode = code.join("");
        if (verificationCode.length !== 6) {
            setError("Please enter all 6 digits");
            return;
        }

        setLoading(true);
        setError("");

        try {
            if (!confirmationResult) {
                throw new Error("Verification session expired. Please try again.");
            }

            const user = await verifySMSCode(confirmationResult, verificationCode);

            console.log("User authenticated successfully:", user);


            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("isAuthenticated", "true");
            localStorage.removeItem("tempPhoneNumber"); // Clean up temp data

            onSuccess(user);

        } catch (err) {
            console.error("Verification error:", err);

            if (err.code) {
                switch (err.code) {
                    case 'auth/invalid-verification-code':
                        setError("Invalid verification code. Please check and try again.");
                        break;
                    case 'auth/code-expired':
                        setError("Verification code has expired. Please request a new one.");
                        break;
                    case 'auth/too-many-requests':
                        setError("Too many attempts. Please try again later.");
                        break;
                    default:
                        setError("Verification failed. Please try again.");
                }
            } else {
                setError(err.message || "Verification failed. Please try again.");
            }

            setCode(["", "", "", "", "", ""]);
            setTimeout(() => {
                inputRefs.current[0]?.focus();
            }, 100);
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        setResendDisabled(true);
        setResendTimer(60);

        console.log("Resend requested for:", phoneNumber);

        alert(`A new verification code has been sent to ${phoneNumber}`);
    };

    return (
        <div className="flex flex-col gap-6 items-center w-full max-w-md mx-auto p-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800">Enter Verification Code</h2>
                <p className="text-gray-600 mt-2">
                    Enter the 6-digit code sent to<br />
                    <span className="font-semibold text-gray-800">{phoneNumber || "your phone"}</span>
                </p>
            </div>

            <form onSubmit={handleSubmit} className="w-full" onPaste={handlePaste}>
                <div className="flex justify-center gap-2 sm:gap-3 mb-6">
                    {code.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handleCodeChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onFocus={(e) => e.target.select()}
                            className="w-12 h-12 sm:w-14 sm:h-14 text-center text-2xl font-bold 
                                     border-2 border-gray-300 rounded-lg 
                                     focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                                     transition-all duration-200
                                     disabled:bg-gray-100 disabled:cursor-not-allowed"
                            disabled={loading}
                            autoComplete="one-time-code"
                        />
                    ))}
                </div>

                {error && (
                    <div className="text-red-600 text-center mb-4 p-3 bg-red-50 rounded-lg">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-black text-white rounded-xl text-lg font-medium 
                             disabled:opacity-50 disabled:cursor-not-allowed
                             hover:bg-gray-800 active:bg-gray-900 
                             transition-colors duration-200
                             flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            Verifying...
                        </>
                    ) : (
                        "Verify Code"
                    )}
                </button>
            </form>

            <div className="text-center space-y-4">
                <button
                    onClick={handleResendCode}
                    disabled={resendDisabled || loading}
                    className="text-blue-600 hover:text-blue-800 disabled:text-gray-400 
                             disabled:cursor-not-allowed font-medium"
                >
                    {resendDisabled
                        ? `Resend code in ${resendTimer}s`
                        : "Resend code"
                    }
                </button>

                <div className="pt-4 border-t border-gray-200">
                    <button
                        onClick={onBack}
                        className="text-gray-600 hover:text-gray-800 
                                 flex items-center justify-center gap-1"
                    >
                        <span>←</span>
                        Back to phone number entry
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmLogin;