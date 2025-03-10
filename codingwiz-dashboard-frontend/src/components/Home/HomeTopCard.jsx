function HomeTopCard({data}) {
    return (
        <>
            <div className="flex justify-between items-center my-1 lg:my-3 flex-wrap">
                {/* card1 */}
                <div className="w-[45%] md:w-[24%] shadow-md rounded-md p-3 my-3 border">
                    <div className="text-gray-500 tracking-wide text-xs">TODAY'S PAYMENT</div>
                    <div className="flex justify-between items-end my-3 flex-wrap gap-2">
                        <div className="text-2xl font-bold"><i className="bi bi-currency-rupee"></i>{data?.volume_today || 0}</div>
                        <p className="text-xs text-green-500 font-semibold"><i className="bi bi-plus-lg"></i> 29% <i className="bi bi-arrow-up"></i></p>
                    </div>
                </div>
                {/* Card2 */}
                <div className="w-[45%] md:w-[24%] shadow-md rounded-md p-3 my-3 border">
                    <div className="text-gray-500 tracking-wide text-xs">THIS WEEK</div>
                    <div className="flex justify-between items-end my-3 flex-wrap gap-2">
                        <div className="text-2xl font-bold"><i className="bi bi-currency-rupee"></i>{data?.volume_1_week || 0}</div>
                        <p className="text-xs text-green-500 font-semibold"><i className="bi bi-plus-lg"></i> 9% <i className="bi bi-arrow-up"></i></p>
                    </div>
                </div>
                {/* Card3 */}
                <div className="w-[45%] md:w-[24%] shadow-md rounded-md p-3 my-3 border">
                    <div className="text-gray-500 tracking-wide text-xs">TOTAL TRANSACTIONS</div>
                    <div className="flex justify-between items-end my-3 flex-wrap gap-2">
                        <div className="text-2xl font-bold">{data?.total_txs || 0}</div>
                        <p className="text-xs text-green-500 font-semibold"><i className="bi bi-plus-lg"></i> 14% <i className="bi bi-arrow-up"></i></p>
                    </div>
                </div>
                {/* Card4 */}
                <div className="w-[45%] md:w-[24%] shadow-md rounded-md p-3 my-3 border">
                    <div className="text-gray-500 tracking-wide text-xs">UNIQUE USERS</div>
                    <div className="flex justify-between items-end my-3 flex-wrap gap-2">
                        <div className="text-2xl font-bold">{data?.unique_users || 3}</div>
                        <p className="text-xs text-green-500 font-semibold"><i className="bi bi-plus-lg"></i> 36% <i className="bi bi-arrow-up"></i></p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HomeTopCard;