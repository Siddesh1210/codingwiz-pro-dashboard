import DeveloperPage from "../components/Developer/DeveloperPage";
import { useState, useEffect } from "react";
import { useFetchDetail } from "../hooks/useFetchDetail";
import { useSelector } from "react-redux";

function Developer() {
    const [apiData, setAPIData] = useState([]);
    const token = useSelector((state) => state.auth.token);
        useEffect(()=>{
            getAPIData();
        },[])
    
    
        async function getAPIData() {
            const response = await useFetchDetail(`api/v1/api-key?user_id=${token}`);
            setAPIData(response);
        }
    return(
        <>
            <div className="w-[100%] lg:w-[85%] min-h-screen p-4">
                <DeveloperPage apiData={apiData}/>
            </div>
        </>
    )
}

export default Developer;