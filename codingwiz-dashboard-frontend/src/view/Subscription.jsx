import SubscriptionTopCard from "../components/Subscription/SubscriptionTopCard";
import { useState, useEffect } from "react";
import { useFetchDetail } from "../hooks/useFetchDetail";
import PaymentHistory from "../components/Subscription/PaymentHistory";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAddDetail, useMakePayment } from "../hooks/useAddDetail";

function Subscription() {
    const [subscriptionTopCardData, setSubscriptionTopCardData] = useState([]);
    const [paymentHistoryData, setPaymentHistoryData] = useState([]);
    const token = useSelector((state) => state.auth.token);
    const [loading2, setLoading2] = useState(false);
    const [showBuyModal, setShowBuyModal] = useState(false);
    const [buySubscriptionData, setBuySubscriptionData] = useState({
        tier: "1",
        month: "1",
        user_id: token,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBuySubscriptionData((prev) => ({
        ...prev,
        [name]: value,
        }));
    };

    const handleBuySubscription = async () => {
        if (!buySubscriptionData.tier.trim() || !buySubscriptionData.month) {
            return toast.error("All input fields are required!", {
                position: "top-center",
            });
        }
    
        setLoading2(true);
        try {
            // Calculate total amount in INR
            let totalPay = 0;
            if (buySubscriptionData.tier == "1") {
                totalPay = 39 * Number(buySubscriptionData.month);
            } else if (buySubscriptionData.tier == "2") {
                totalPay = 149 * Number(buySubscriptionData.month);
            }
    
            // Convert amount to paise (multiply by 100)
            const amountInPaise = totalPay * 100;
    
            // Create an order from backend
            const response = await useAddDetail("api/v1/auth/order", {
                amount: amountInPaise, // Sending amount in paise
                currency: "INR",
                receipt:  `order_${new Date().getTime()}`,
            });
    
            const startDate = new Date(); // Get current date in UTC

            // Create end date by adding months as days (approximate calculation)
            let endDate = new Date();
            endDate.setDate(startDate.getDate() + Number(buySubscriptionData.month) * 30);

            // Convert both dates to IST manually
            const convertToIST = (date) => {
                let istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC + 5:30
                return new Date(date.getTime() + istOffset);
            };

            const startDateIST = convertToIST(startDate);
            const endDateIST = convertToIST(endDate);
            // Razorpay payment options
            var options = {
                key: "rzp_test_e2SIN0SFihM4bx",
                amount: amountInPaise, // Amount in paise
                currency: "INR",
                description: "Payment for Subscription on Codingwiz",
                image: "https://codingwiz.vercel.app/static/media/cw_logo.54af4673e405b89da8fc.png",
                prefill: {
                    email: "codingwiz@support.com",
                    contact: 9623235838,
                },
                order_id: response.data.id, // Order ID from backend
                handler: async function (response) {
                    // alert(response.razorpay_payment_id);
                    // alert(response.razorpay_order_id);
                    // alert(response.razorpay_signature);
                    const validateorder = {
                        ...response,
                        razorpay_amount: amountInPaise/100,
                        razorpay_payment_status: "completed",
                        tier: buySubscriptionData.tier,
                        startDate: startDateIST,
                        endDate: endDateIST,
                    }
                    const result = await useAddDetail("api/v1/auth/validate-order", validateorder);
                    toast.success("Buying Subscription Successful!", {
                        position: "top-center",
                        autoClose: 2000,
                    });
                    setTimeout(()=>{
                        toast.info("Fetching updated data!", {
                            position: "top-center",
                            autoClose: 2000,
                        });
                    }, 2000)
                    setTimeout(()=>{
                        getSubscriptionTopCardData();
                        getPaymentHistoryData();
                    }, 3000)
                },
                modal: {
                    escape: false, // Prevents escape key from closing modal
                    ondismiss: async function () {
                        const failedorder = {
                            razorpay_order_id: response.data.id,
                            razorpay_amount: amountInPaise/100,
                            razorpay_payment_status: "failed",
                            tier: buySubscriptionData.tier,
                            startDate: startDateIST,
                            endDate: endDateIST,
                        }
                        const result = await useAddDetail("api/v1/auth/failed-order", failedorder);
                        toast.error("Buying Subscription Failed!", {
                            position: "top-center",
                            autoClose: 2000,
                        });
                        setTimeout(()=>{
                            toast.info("Fetching updated data!", {
                                position: "top-center",
                                autoClose: 2000,
                            });
                        }, 2000)
                        setTimeout(()=>{
                            getSubscriptionTopCardData();
                            getPaymentHistoryData();
                        }, 3000)
                    }
                }
            };
    
            var rzp1 = new window.Razorpay(options);
            rzp1.open();
        } catch (error) {
            toast.error("Buying Subscription Failed!", {
                position: "top-center",
                autoClose: 4000,
            });
        } finally {
            setShowBuyModal(false);
            setLoading2(false);
        }
    };

    useEffect(()=>{
        getSubscriptionTopCardData();
        getPaymentHistoryData();
    },[])
        
        
    async function getSubscriptionTopCardData() {
        try {
            const response = await useFetchDetail(`api/v1/user/plan-details?user_id=${token}`);
            // setSubscriptionTopCardData(response[0]);
            // Assuming response[0] contains the data
            const formattedData = {
                ...response[0],
                created_at: response[0]?.created_at?.split("T")[0], // Extract only the date part
                end_date: response[0]?.end_date?.split("T")[0] // Extract only the date part
            };
            
            // Set the formatted data in state
            setSubscriptionTopCardData(formattedData);
        } catch (error) {   
            if(error == "Error: No Result found") return;
            toast.error(error || "Something went wrong!", {
                position: "top-center", 
                autoClose: 4000
            });
        }
    }

    async function getPaymentHistoryData() {
            const response = await useFetchDetail(`api/v1/user/plan-details?user_id=${token}`);
            setPaymentHistoryData(response);
    }

    return(
        <>
            <div className="w-[100%] lg:w-[85%] min-h-screen p-4">
            <div className="flex justify-between items-end flex-wrap mb-6">
                <h1 className="text-3xl font-bold">Subscriptions</h1>
                <button className="px-2 py-1 text-sm bg-primary text-white rounded-md cursor-pointer font-semibold" onClick={() => setShowBuyModal(true)}>
                <i className="bi bi-plus-lg"></i> Buy Subscription
                </button>
            </div>
                <SubscriptionTopCard data={subscriptionTopCardData}/>
                <PaymentHistory data={paymentHistoryData}/>
            </div>
            {/* Buy Subscription Modal */}
            {showBuyModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="mt-[10vh] mx-2 bg-white rounded-lg p-6 max-w-[500px] max-h-[80vh] overflow-y-auto shadow-lg">
                    <div className="flex justify-between items-center">
                    <h2 className="text-md font-bold mb-4">Buy Subscription</h2>
                    <p className="text-xl font-bold cursor-pointer text-primary" onClick={() => setShowBuyModal(false)}>X</p>
                    </div>
                    <div className="grid grid-cols-1 gap-3 text-xs">
            
                        {/* Plan Type */}
                        <div>
                        <label className="text-xs font-semibold">Select Plan</label>
                        <select
                            name="tier"
                            className="w-full border border-gray-300 p-2 rounded-md outline-none focus:border focus:border-primary mt-2"
                            value={buySubscriptionData.tier}
                            onChange={handleChange}
                        >
                            <option value={1}>Starter</option>
                            <option value={2}>Growth</option>
                            {/* <option value={3}>Gold</option> */}
                        </select>
                        </div>

                        {/* PLan Duration */}
                        <div>
                        <label className="text-xs font-semibold">Plan Duration</label>
                        <select
                            name="month"
                            className="w-full border border-gray-300 p-2 rounded-md outline-none focus:border focus:border-primary mt-2"
                            value={buySubscriptionData.month}
                            onChange={handleChange}
                        >
                            <option value={1}>1 Month</option>
                            <option value={3}>3 Months</option>
                            <option value={6}>6 Months</option>
                            <option value={12}>12 Months</option>
                        </select>
                        </div>
            
                        
                    </div>
            
                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-2 mt-4">
                        <button
                        onClick={() => setShowBuyModal(false)}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                        >
                        Cancel
                        </button>
                        <button
                        onClick={handleBuySubscription}
                        className="px-3 py-2 bg-primary text-white rounded-md text-sm"
                        >
                        {loading2 ? "Buying..." : "Buy"}
                        </button>
                    </div>
                    </div>
                </div>
                )}
            <ToastContainer/>
        </>
    )
}

export default Subscription;