import { useNavigate } from "react-router-dom";

function HomeFeature({data}) {
    const navigate = useNavigate();
    return(
        <>
            <div className="w-[100%] md:w-[30%]">
                {/* card1 */}
                <div className="shadow-md rounded-md p-3 my-3 border">
                    <div className="text-gray-500 tracking-wide text-xs">TOTAL VOLUME</div>
                    <div className="flex justify-between items-end my-3 flex-wrap gap-2">
                        <div className="text-2xl font-bold"><i className="bi bi-currency-rupee"></i>{data?.total_volume || 0}</div>
                        <p className="text-xs text-green-500 font-semibold"><i className="bi bi-plus-lg"></i> 16% <i className="bi bi-arrow-up"></i></p>
                    </div>
                </div>
                {/* card2 */}
                <div className="shadow-md rounded-md p-3 my-3 border">
                    <div className="text-gray-700 font-bold tracking-wide text-sm">Get one-touch Subscription</div>
                    <p className="text-xs font-light text-gray-500 my-2">Try Free Trial Initially For 20 Days</p>
                    <button className="bg-primary border-none px-2 py-1 rounded-md text-xs text-white my-3" onClick={()=>navigate("/subscription")}> <i className="bi bi-plus-lg"></i> Look for Subscription</button>
                </div>
                {/* card3 */}
                <div className="shadow-md rounded-md p-3 my-3 border">
                    <div className="text-gray-700 font-bold tracking-wide text-sm">Developer API Key</div>
                    <p className="text-xs font-light text-gray-500 my-2">Access to Developer API Key</p>
                    <button className="bg-primary border-none px-2 py-1 rounded-md text-xs text-white my-3" onClick={()=>navigate("/developer")}> <i className="bi bi-plus-lg"></i> Look for API-Key</button>
                </div>
            </div>
        </>
    )
}

export default HomeFeature;