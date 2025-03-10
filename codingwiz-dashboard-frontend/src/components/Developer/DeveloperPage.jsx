import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAddDetail } from "../../hooks/useAddDetail";
import { useFetchDetail } from "../../hooks/useFetchDetail";
import { useSelector } from "react-redux";
import { useDeleteDetail } from "../../hooks/useDeleteDetail";

function DeveloperPage({ apiData = [] }) {
  const [allData, setAllData] = useState(apiData);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [secretKey, setSecretKey] = useState('');

  useEffect(()=>{
    setSecretKey(localStorage.getItem('api_secret'));
  })

  const itemsPerPage = 10;
//   const totalPages = Math.ceil(allData.length / itemsPerPage);
//   const allData = allData.length > 0 ? allData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) : [];

//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= totalPages) {
//       setCurrentPage(newPage);
//     }
//   };

  useEffect(()=>{
    getallData()
  }, [apiData])

  async function getallData() {
    const response = await useFetchDetail(`api/v1/api-key?user_id=${token}`);
    setAllData(response);
  }

  const handleGenerateKey = async () => {
    if (!apiKey.trim()) return alert("API Key is required!");

    setLoading(true);
    try {
      const response = await useAddDetail('api/v1/api-key', {
            user_id: token,
            api_key: apiKey
        })
        localStorage.setItem('api_secret', response.data?.api_secret);
        setSecretKey(response.data?.api_secret);
        toast.success("API Generated Successfully!", {
            position: "top-center",
            autoClose: 4000 
        });
        getallData();
      // Clear input
    } catch (error) {
      toast.error("API Generation Fail!", {
            position: "top-center",
            autoClose: 4000 
        });
    } finally {
        // setShowModal(false);
        setApiKey(""); 
        setLoading(false);
    }
  };

  async function handleDeleteKey() {
    setLoading(true);
    try {
      const response = await useDeleteDetail('api/v1/api-key', {
            user_id: token,
        })
        localStorage.removeItem('api_secret');
        toast.success("API Key Deleted Successfully!", {
            position: "top-center",
            autoClose: 2000 
        });
        setTimeout(()=>{
            toast.info("Fetching updated Data!", {
                position: "top-center",
                autoClose: 2000 
            });
        }, 2000)
        setTimeout(()=>{
            getallData();
        }, 3000)
      // Clear input
    } catch (error) {
      toast.error("Deleting API Failed!", {
            position: "top-center",
            autoClose: 4000 
        });
    } finally {
        setShowDeleteModal(false);
        setApiKey(""); 
        setLoading(false);
    }
  }

  return (
    <>
      <div className="flex justify-between items-end flex-wrap mb-6">
        <h1 className="text-3xl font-bold">Personal Access Token</h1>
        <button onClick={() => setShowModal(true)} className="px-2 py-1 text-sm border border-gray-300 rounded-md cursor-pointer font-semibold">
          <i className="bi bi-plus-lg"></i> {secretKey ? 'Copy Key' : 'Generate Key'}
        </button>
      </div>

      <p className="text-sm">Tokens you have generated to access <span className="text-blue-500 cursor-pointer">Codingwiz API</span></p>

      {
        allData?.api_key && (
            <div className="overflow-x-auto my-6">
                <table className="min-w-full bg-white border-y-0 border-gray-200 text-sm text-center">
                <thead>
                    <tr className="border-y-0 bg-gray-100">
                    <th className="px-4 py-2">Api Key</th>
                    <th className="px-4 py-2">Secret Key</th>
                    <th className="px-4 py-2">Tier</th>
                    <th className="px-4 py-2">Created On</th>
                    <th className="px-4 py-2">isActive</th>
                    <th className="px-4 py-2">Expires on</th>
                    <th className="px-4 py-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {allData ? (
                        <tr className="border-b">
                        <td className="px-4 py-2">{allData?.api_key || "N/A"}</td>
                        <td className="px-4 py-2">{secretKey || "N/A"}</td>
                        <td className="px-4 py-2">{allData?.tier || "N/A"}</td>
                        <td className="px-4 py-2">{allData?.api_created_on ? new Date(allData.api_created_on).toLocaleString() : "N/A"}</td>
                        <td className="px-4 py-2">{allData?.isactive ? 'true' : 'false'}</td>
                        <td className="px-4 py-2">{allData?.api_expiry ? new Date(allData.api_expiry).toLocaleString() : "N/A"}</td>
                        <td className="px-4 py-2 text-center" onClick={() => setShowDeleteModal(true)}>
                            <button className="text-red-600">Delete</button>
                        </td>
                        </tr>
                    ) : (
                    <tr>
                        <td colSpan={5} className="text-center py-2">No records found.</td>
                    </tr>
                    )}
                </tbody>
                </table>
            </div>
        )
      }

      {/* Pagination */}
      {/* {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50">
            Prev
          </button>
          <span className="px-4 py-2">{currentPage}</span>
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50">
            Next
          </button>
        </div>
      )} */}

      {/* No Keys Section */}
      {!allData.api_key && (
        <div className="h-[70vh] flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm my-2 text-gray-600">No key generated</p>
            <p className="text-md my-2">Generate your first personal access token</p>
            <button onClick={() => setShowModal(true)} className="px-2 py-1 bg-blue-500 text-white rounded-md cursor-pointer">
              <i className="bi bi-plus-lg"></i> Generate Key
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">{allData?.api_key ? 'Copy Secret' : 'Generate API'}  Key</h2>
            {
                allData?.api_key && (
                    <div className="relative my-3">
                        <input
                        type="text"
                        className="w-full border border-gray-300 p-2 rounded-md pr-12"
                        value={secretKey}
                        readOnly
                        disabled
                        />
                        
                        {allData?.api_key && (
                        <button
                            onClick={() => {
                            navigator.clipboard.writeText(secretKey);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                            }}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-300 px-2 py-1 rounded text-sm"
                        >
                            {copied ? "Copied!" : "Copy"}
                        </button>
                        )}
                    </div>
                )
            }
            {
                !allData?.api_key && (
                    <input
                        type="text"
                        className="w-full border border-gray-300 p-2 rounded-md mb-4"
                        placeholder="Enter API Key"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        />

                )
            }

            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 rounded-md">Cancel</button>
              {
                !allData?.api_key && (
                    <button onClick={handleGenerateKey} className="px-4 py-2 bg-primary text-white rounded-md">
                        {loading ? "Generating..." : "Generate Key"}
                    </button>
                )
              }
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-md my-8 text-center">Are you sure you want to delete API Key?</h2>
            <div className="flex justify-center space-x-2">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 border border-gray-300 rounded-md">Cancel</button>
              <button onClick={handleDeleteKey} className="px-4 py-2 bg-primary text-white rounded-md">
                {loading ? "Deleting..." : "Delete Key"}
              </button>
            </div>
          </div>
        </div>
      )}


      <ToastContainer />
    </>
  );
}

export default DeveloperPage;
