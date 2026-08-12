import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../components/AxiosInstance";
import { useNotification } from "../notify/context/NotificationContext";
import { useAuth } from "../components/AuthProvider"; // Add this import
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import TransactionHistorySkeleton from "../skeletons/TransactionHistorySkeleton";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();
  const addNotification = useNotification();
  const { currentUser } = useAuth(); // Add this to check auth state

  const fetchTransactions = async (page = 1, type = "all") => {
    setLoading(true);
    setError(null);

    try {
      console.log("Fetching transactions..."); // Debug log

      const response = await axios.get(`/user/my-transactions`, {
        params: {
          page,
          limit: 10,
          type,
        },
        withCredentials: true,
      });

      console.log("Transaction response:", response.data); // Debug log

      setTransactions(response.data.transactions);
      setCurrentPage(response.data.summary.currentPage);
      setTotalPages(response.data.summary.totalPages);
      setHasMore(response.data.summary.hasMore);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError(
        error.response?.data?.message || "Failed to fetch transaction history"
      );
      addNotification(
        "danger",
        error.response?.data?.message || "Failed to fetch transaction history"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Current user:", currentUser); // Debug log

    // Only fetch transactions if user is authenticated
    if (currentUser === null) {
      // User is not authenticated, redirect to login
      navigate("/signin");
      return;
    }

    if (currentUser && currentUser !== undefined) {
      fetchTransactions(1, filter);
    }
  }, [filter, currentUser, navigate]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    fetchTransactions(page, filter);
  };

  const handleGoBack = () => {
    navigate("/dashboard");
  };

  // Show loading while auth state is being determined
  if (currentUser === undefined) {
    return (
      <>
        <Header />
        <div className="bg-[#163300] border-t border-[#fefefe] min-h-[86.3vh] md:min-h-[86.7vh] lg:min-h-[90.1vh] 2xl:min-h-[100vh] flex justify-center items-center">
          <div className="text-white text-xl">Loading...</div>
        </div>
        <Footer />
      </>
    );
  }

  // Show loading skeleton while fetching transactions
  if (loading) {
    return (
      <>
        <Header />
        <TransactionHistorySkeleton />
        <Footer />
      </>
    );
  }

  // Show error state
  if (error) {
    return (
      <>
        <Header />
        <div className="bg-[#163300] border-t border-[#fefefe] min-h-[86.3vh] md:min-h-[86.7vh] lg:min-h-[90.1vh] 2xl:min-h-[100vh] flex justify-center items-start pt-20">
          <div className="w-11/12 md:w-8/12 lg:w-6/12">
            <div className="flex flex-col justify-center rounded-[32px] bg-white text-center p-8 h-max">
              <h3 className="text-2xl font-bold mb-4 text-red-600">Error</h3>
              <p className="text-gray-700 mb-4">{error}</p>
              <button
                onClick={() => fetchTransactions(1, filter)}
                className="w-full text-white font-bold bg-[#163300] border border-[#163300] transition-colors duration-150 ease-in-out hover:bg-[#2a4d00] text-base rounded-full select-none py-2 px-4 mb-4"
              >
                Retry
              </button>
              <button
                onClick={handleGoBack}
                type="button"
                className="w-full text-[#163300] font-bold bg-[#ffffff1a] border border-[#9fe870] transition-colors duration-150 ease-in-out hover:bg-[#9fe870] hover:text-[#163300] text-base rounded-full select-none py-2 px-4"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="bg-[#163300] border-t border-[#fefefe] min-h-[86.3vh] md:min-h-[86.7vh] lg:min-h-[90.1vh] 2xl:min-h-[100vh] flex justify-center items-start pt-20">
        <div className="w-11/12 md:w-8/12 lg:w-6/12">
          <div className="flex flex-col justify-center rounded-[32px] bg-white text-center p-8 h-max">
            <h3 className="text-2xl font-bold mb-4">Transaction History</h3>
            <div className="border-t border-[#0e0f0c1f] my-5"></div>

            {/* Filter Buttons */}
            <div className="flex gap-2 mb-6 justify-center flex-wrap">
              <button
                onClick={() => handleFilterChange("all")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-150 ${
                  filter === "all"
                    ? "bg-[#163300] text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleFilterChange("sent")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-150 ${
                  filter === "sent"
                    ? "bg-[#163300] text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Sent
              </button>
              <button
                onClick={() => handleFilterChange("received")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-150 ${
                  filter === "received"
                    ? "bg-[#163300] text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Received
              </button>
            </div>

            {/* Transaction List */}
            <div className="space-y-4">
              {transactions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No transactions found.</p>
                </div>
              ) : (
                transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="border border-gray-200 rounded-lg p-4 text-left hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span
                        className={`font-semibold ${
                          transaction.type === "SENT"
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {transaction.type}
                      </span>
                      <span className="font-bold text-lg">
                        ₹{transaction.amount}
                      </span>
                    </div>

                    <p className="text-gray-700 mb-2">
                      {transaction.description}
                    </p>

                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>{transaction.formattedTime}</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          transaction.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-150 ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-[#163300] text-white hover:bg-[#2a4d00]"
                  }`}
                >
                  Previous
                </button>

                <span className="px-4 py-2 text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-150 ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-[#163300] text-white hover:bg-[#2a4d00]"
                  }`}
                >
                  Next
                </button>
              </div>
            )}

            {/* Back Button */}
            <div className="mt-6">
              <button
                onClick={handleGoBack}
                type="button"
                className="w-full text-[#163300] font-bold bg-[#ffffff1a] border border-[#9fe870] transition-colors duration-150 ease-in-out hover:bg-[#9fe870] hover:text-[#163300] text-base rounded-full select-none py-2 px-4"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TransactionHistory;
