import { useEffect } from "react";
import HomeFeature from "../components/Home/HomeFeature";
import HomeTopCard from "../components/Home/HomeTopCard";
import TransactionChart from "../components/Home/TransactionChart";
import RecentPayment from "../components/Payment/RecentPayment";
import { useFetchDetail } from "../hooks/useFetchDetail";
import { useState } from "react";
import { useSelector } from "react-redux";

function Home() {
    const [homeTopCardData, setHomeTopCardData] = useState([]);
    const [transactionChartData, setTransactionChartData] = useState([]);
    const [paymentData, setPaymentData] = useState([]);
    const token = useSelector((state) => state.auth.token);

    useEffect(()=>{
        getHomeTopCardData();
        getTransactionChartData();
        getRecentPayment();
    },[])

    async function getHomeTopCardData() {
        const response = await useFetchDetail(`api/v1/dashboard/stats?user_id=${token}`);
        setHomeTopCardData(response[0]);
    }

    async function getTransactionChartData() {
        const response = await useFetchDetail(`api/v1/dashboard/graph?user_id=${token}`);
        setTransactionChartData(response);
    }

    async function getRecentPayment() {
        const response = await useFetchDetail(`api/v1/dashboard/recent-txs?user_id=${token}&limit=10&page=1`);
        setPaymentData(response);
    }


    return(
        <>
            <div className="w-[100%] lg:w-[85%] min-h-screen p-4">
                <h1 className="text-3xl font-bold">Today</h1>
                <HomeTopCard data={homeTopCardData}/>
                <div className="flex flex-wrap-reverse justify-between items-center">
                    <TransactionChart apiData={transactionChartData}/>
                    <HomeFeature data={homeTopCardData}/>
                </div>
                <RecentPayment data={paymentData}/>
            </div>
        </>
    )
}

export default Home;