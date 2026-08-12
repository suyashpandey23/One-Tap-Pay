import { Link } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { useNotification } from "../notify/context/NotificationContext";

export const Header = () => {
  const { currentUser, logout } = useAuth();
  const addNotification = useNotification();

  if (currentUser === undefined) {
    return <div>Loading...</div>;
  }

  const handleLogout = async () => {
    try {
      const response = await logout();
      addNotification("success", response.message || "Logged out successfully");
    } catch (error) {
      console.error("Failed to logout:", error);
      addNotification(
        "danger",
        error.response?.data?.message || "Logout failed. Please try again."
      );
    }
  };

  return (
    <header className="bg-[#5f605e]">
      <div className="px-1 md:px-32 py-1 flex items-center">
        <div className="flex gap-1 md:gap-2 items-center justify-start flex-grow">
          <Link to={"/"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-14"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 8.25H9m6 3H9m3 6-3-3h1.5a3 3 0 1 0 0-6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </Link>
          {!currentUser && (
            <Link
              to={"/dashboard"}
              className="text-base rounded-full py-1 px-4 text-[#163300] bg-[#9fe870] border border-[#9fe870] "
            >
              Send Money
            </Link>
          )}
          {currentUser && (
            <h6 className="text-base ms-4 rounded-full py-1 px-4 text-[#163300] bg-[#9fe870] border border-[#9fe870] ">
              Hi{" "}
              {currentUser
                ? currentUser.firstName[0].toUpperCase() +
                  currentUser.firstName[1].toUpperCase()
                : "G"}
              !
            </h6>
          )}
        </div>
        <div className="flex gap-1 md:gap-2 items-center justify-end flex-grow">
          {!currentUser && (
            <Link
              to={"/signin"}
              className="transition-colors duration-150 ease-in-out hover:bg-[#ffffff1a] text-base ms-4 rounded-full py-1 px-2 text-[#9fe870] border border-transparent "
            >
              Log in
            </Link>
          )}
          {!currentUser && (
            <Link
              to={"/signup"}
              className="text-base ms-4 rounded-full py-1 px-4 text-[#163300] bg-[#9fe870] border border-[#9fe870] "
            >
              Register
            </Link>
          )}
          {currentUser && (
            <Link
              to={"/transaction-history"}
              className="transition-colors duration-150 ease-in-out hover:bg-[#ffffff1a] text-base ms-2 rounded-full py-1 px-2 text-[#9fe870] border border-transparent "
            >
              View Transaction History
            </Link>
          )}
          {currentUser && (
            <Link
              to={"/update-account"}
              className="transition-colors duration-150 ease-in-out hover:bg-[#ffffff1a] text-base ms-2 rounded-full py-1 px-2 text-[#9fe870] border border-transparent "
            >
              Update Account
            </Link>
          )}
          {currentUser && (
            <button
              onClick={handleLogout}
              className="text-base ms-4 rounded-full py-1 px-4 text-[#163300] bg-[#9fe870] border border-[#9fe870] "
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
