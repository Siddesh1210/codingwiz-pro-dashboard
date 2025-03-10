import { useEffect, useState } from 'react';
import codingwizLogo from '../assets/images/codingwiz_logo.png';
import VerifyOtp from './VerifyOtp';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAddDetail } from '../hooks/useAddDetail';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';

function Login() {
    const [nextPage, setNextPage] = useState(false);
    const [showOtpPage, setShowOtpPage] = useState(false);
    const [email, setEmail] = useState("");
    const [isValid, setIsValid] = useState(false);
    const [isContinue, setIsContinue] = useState(false);
    const navigate = useNavigate();
    const token = useSelector((state) => state.auth.token);

    function handlePage() {
        setNextPage(!nextPage);
    }

    useEffect(()=>{
        if(token) {
            navigate("/");
        }
    },[])

    async function submitEmail() {
        try {
            setIsValid(false);
            setIsContinue(true);
            const response = await useAddDetail('api/v1/auth/login', {
                    email: email
            })
            toast.success("OTP Sent Successfully!", {
                position: "top-center",
                autoClose: 4000 
            });
            setShowOtpPage(!showOtpPage);
        } catch (error) {
            toast.error(error || "Something went wrong!", {
                position: "top-center",
                autoClose: 4000
            });
        }
        finally {
            setIsContinue(false);
            setIsValid(true);
        }
    }
    // Email validation function
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        setIsValid(validateEmail(value));
    };

    function makeOtpPageFalse() {
        setShowOtpPage(false);
    };

    return(
        <>
            {
                showOtpPage == false ? (
                    <div className="w-100 min-h-screen bg-secondary flex justify-center items-center">
                <div className="md:w-[40%] w-[90%] flex flex-col justify-center text-center items-center">
                    <div className='flex justify-center items-center gap-4 my-4'>
                        <img src={codingwizLogo} alt="codingwiz-Logo" width="60px" className='filter grayscale'/>
                        <h1 className='text-4xl font-bold text-black'>Codingwiz Pro</h1>
                    </div>

                    {
                        nextPage == false ? 
                        (
                        <div className="w-[90%] bg-white my-3 p-5 rounded-xl flex flex-col justify-center items-center">
                            <h3 className='text-2xl font-bold my-3'>Sign in to your account</h3>
                            <p className='text-gray-500 text-md my-3 tracking-wide'>Codingwiz is available on Ethereum, Polygon, XDC-Network, <br></br>BSC and Sepolia</p>
                            <button onClick={handlePage} className='w-[90%] bg-primary py-2 rounded-md text-white text-center cursor-pointer flex items-center justify-center gap-3 my-3 text-md border-primary'><i className="bi bi-envelope"></i> Sign in with your Email</button>
                        </div>) : 
                            <div className="w-[90%] bg-white my-3 p-5 rounded-xl flex flex-col justify-center items-center">
                                <div className='min-w-[100%] text-start text-2xl'><i className="bi bi-arrow-left cursor-pointer" onClick={handlePage}></i></div>
                                <h3 className='px-5 py-4 rounded-full bg-secondary text-gray-500 text-3xl my-3'><i className="bi bi-envelope"></i></h3>
                                <h3 className='text-2xl font-bold my-3'>Sign in with your Email</h3>
                                <div className='relative w-[100%]'>
                                <input
                                    type="email"
                                    className={`w-[90%] px-10 py-2 my-3 outline-none border rounded-md focus:border-primary`}
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={handleChange}
                                />
                                    <div className='absolute top-5 left-8 md:left-10'><i className="bi bi-envelope"></i></div>
                                </div>
                                <button
                                    type='button'
                                    className={`w-[90%] py-2 rounded-md text-white text-center flex items-center justify-center gap-3 my-3 text-md border-primary 
                                    ${isValid ? "bg-primary cursor-pointer" : "bg-gray-400 cursor-not-allowed"}`}
                                    onClick={submitEmail}
                                    disabled={!isValid}
                                >
                                    {isContinue ? 'Continue...' : 'Continue'} <i className="bi bi-arrow-right"></i>
                                </button>
                            </div>
                    }


                    <p className='text-sm flex flex-wrap justify-center gap-1 items-center text-gray-500 my-3'> <i className="bi bi-c-circle"></i> Codingwiz 2025 <i className="bi bi-dot"></i> <a href="mailto:support@codingwiz.com">Contact</a> <i className="bi bi-dot"></i> <a href="https://codingwiz.com/privacy-policy/" target='_blank'>Privacy Policy</a> <i className="bi bi-dot"></i> <a href="https://codingwiz.com/terms-and-conditions/" target='_blank'>Terms of Conditions</a></p>
                </div>
                    </div>
                ) : <VerifyOtp userEmail = {email} makeOtpPageFalse = {makeOtpPageFalse}/>
            }
            <ToastContainer />
        </>
    )
}

export default Login;