import codingwizLogo from '../assets/images/codingwiz_logo.png';
import { useState, useRef } from "react";
import { useAddDetail } from '../hooks/useAddDetail';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../redux/slices/authSlice';
function VerifyOtp({userEmail, makeOtpPageFalse}) {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]); // Store OTP
    const inputRefs = useRef([]);
    const [isOtpButtonDisabled, setIsOtpButtonDisabled] = useState(false);
    const [showDot, setShowDot] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Handle Input Change
    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return; // Allow only numbers

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Move to next input if value is entered
        if (value && index < 5) {
        inputRefs.current[index + 1].focus();
        }
    };

    // Handle KeyDown (for backspace navigation)
    const handleKeyDown = (index, event) => {
        if (event.key === "Backspace" && !otp[index] && index > 0) {
        inputRefs.current[index - 1].focus();
        }
    };

    const isOtpValid = otp.every((digit) => digit !== "");

    async function verifyOtp() {
        try {
            setIsOtpButtonDisabled(true);
            const response = await useAddDetail('api/v1/auth/verify', {
                    email: userEmail,
                    otp: otp.join("")
            })
            toast.success("OTP Verified Successfully!", {
                position: "top-center",
                autoClose: 2000 
            });
            setOtp(["", "", "", "", "", ""]);
            dispatch(login(response?.data?.user_id));
            setTimeout(()=>{
                navigate("/");
            }, 1000);
        } catch (error) {
            toast.error(error || "Something went wrong!", {
                position: "top-center",
                autoClose: 4000
            });
        }
        finally {
            setIsOtpButtonDisabled(false);
        }
    }

    async function resendOtp() {
        try {
            setOtp(["", "", "", "", "", ""]);
            setShowDot(true);
            const response = await useAddDetail('api/v1/auth/resendotp', {
                    email: userEmail,
            })
            toast.success("OTP Resent Successfully!", {
                position: "top-center",
                autoClose: 4000 
            });
        } catch (error) {
            toast.error(error || "Something went wrong!", {
                position: "top-center",
                autoClose: 4000
            });
        }
        finally {            
            setShowDot(false);
        }
    }

    return(
        <>
            <div className="w-100 min-h-screen bg-secondary flex justify-center items-center">
                <div className="md:w-[40%] w-[90%] flex flex-col justify-center text-center items-center">
                    <div className='flex justify-center items-center gap-4 my-4'>
                        <img src={codingwizLogo} alt="codingwiz-Logo" width="60px" className="filter grayscale"/>
                        <h1 className='text-4xl font-bold text-black'>codingwiz Pro</h1>
                    </div>

                    <div className="w-[90%] bg-white my-3 p-5 rounded-xl flex flex-col justify-center items-center">
                        <h3 className='text-2xl font-bold my-3'>Email authentication</h3>
                        <p className='text-gray-500 text-md my-3 tracking-wide'>To continue, please enter the 6-digit verification code sent to<br></br>your Email: {userEmail} <span className='text-primary cursor-pointer mx-1' onClick={makeOtpPageFalse}><i className="bi bi-pencil-square"></i></span></p>

                        <div className="flex gap-3 my-3">
                            {otp.map((value, index) => (
                            <input
                                key={index}
                                type="text"
                                value={value}
                                maxLength="1"
                                ref={(el) => (inputRefs.current[index] = el)}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-10 h-10 md:w-12 md:h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-md focus:border-primary focus:outline-none transition-all"
                            />
                            ))}
                        </div>

                        <p className='my-3 text-md text-gray-500 tracking-wide'>Didn't receive a code? <span className='text-primary cursor-pointer tracking-normal underline' onClick={resendOtp}>Resend{showDot && "..."}
                        </span></p>

                        <button
                            className={`w-[90%] py-2 rounded-md text-white text-center flex items-center justify-center gap-3 my-3 text-md border-primary
                            ${isOtpValid && !isOtpButtonDisabled ? "bg-primary cursor-pointer" : "bg-gray-400 cursor-not-allowed"}`}
                            disabled={!isOtpValid || isOtpButtonDisabled} // Disable button if OTP is incomplete or API call is in progress
                            onClick={verifyOtp}
                        >
                            Verify <i className="bi bi-arrow-right"></i>
                        </button>
                    </div>

                    <p className='text-sm flex flex-wrap justify-center gap-1 items-center text-gray-500 my-3'> <i className="bi bi-c-circle"></i> Codingwiz 2025 <i className="bi bi-dot"></i> Contact <i className="bi bi-dot"></i> Privacy Policy <i className="bi bi-dot"></i> Terms of Conditions</p>
                </div>
            </div>
            <ToastContainer/>
        </>
    )
}

export default VerifyOtp;