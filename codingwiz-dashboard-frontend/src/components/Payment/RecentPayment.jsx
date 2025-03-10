import React, { useEffect, useState } from "react";

const RecentPayment = ({data}) => {
  const [filteredData, setFilteredData] = useState(data);
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleFilterChange = (e) => {
    const filterValue = e?.target?.value;
    setStatusFilter(filterValue);

    if (filterValue === "all") {
      setFilteredData(data);
    } else {
      setFilteredData(data?.filter((item) => item?.status === filterValue));
    }
    setCurrentPage(1); // Reset to the first page
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(()=>{
    setFilteredData(data)
  }, [data])

  // Calculate the indices of the first and last items on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData?.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="w-[100%] p-3">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Recent Payment</h1>
        <div className="relative">
            <select
                value={statusFilter}
                onChange={handleFilterChange}
                className="text-sm px-4 py-2 border border-gray-300 rounded-md"
            >
                <option value="all">All</option>
                <option value="completed">Paid</option>
                <option value="failed">Failed</option>
            </select>
            <p className="absolute -top-3 left-1 bg-white px-2 text-primary">Status</p>
          </div>
      </div>

      <div className="overflow-x-auto rounded-md">
        <table className="min-w-full bg-white border border-gray-200 text-sm text-center">
        <thead>
            <tr className="border-b bg-gray-100">
              <th className="px-4 py-2">Order ID</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Tier</th>
              <th className="px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length ? (
              currentItems.map((item) => (
                <tr key={item?.order_id} className="border-b">
                          <td className="px-4 py-2">{item?.order_id}</td>
                          <td className="px-4 py-2">{item?.status == 'completed' ? <span className="bg-green-200 text-green-500 px-2 rounded-sm">Paid</span> : <span className="bg-red-200 text-red-500 px-2 rounded-sm">Failed</span>}</td>
                          <td className="px-4 py-2">₹ {item?.amount}</td>
                          <td className="px-4 py-2">{item?.tier}</td>
                          <td className="px-4 py-2">{new Date(item?.createdAt)?.toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-2">
                  No recent payments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {/* <div className="flex justify-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-4 py-2">{currentPage}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage * itemsPerPage >= filteredData?.length}
          className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div> */}
    </div>
  );
};

export default RecentPayment;
