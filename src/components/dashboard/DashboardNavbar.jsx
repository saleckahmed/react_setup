
import { useAuth } from "../../hooks/useAuth";
import useLogout from "../../hooks/useLogout";
import { Loader } from "lucide-react";
import CustomLoader from "../shared/CustomLoader";
const SettingsIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z"
    ></path>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    ></path>
  </svg>
);

const LogoutIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3v-3m3-10h4a3 3 0 013 3v1"
    ></path>
  </svg>
);

const DashboardNavbar = () => {
  const { setIsAuthenticated } = useAuth();
  const { logout, isLoading } = useLogout();
  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
  };

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-14 px-6 bg-white shadow-md border-b border-gray-100">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-blue-600">Product Track</h1>
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 overflow-hidden rounded-full">
            <img
              className="object-cover w-full h-full"
              src="https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.jpg?semt=ais_incoming&w=740&q=80"
              alt="User Avatar"
            />
          </div>
          <div className="flex flex-col text-sm leading-tight">
            <span className="font-medium text-gray-800">John Doe</span>
            <span className="text-xs text-gray-500">Administrator</span>
          </div>
          <button className="p-1 text-gray-400 transition duration-150 ease-in-out rounded-full hover:text-blue-600 focus:outline-none">
            <SettingsIcon />
          </button>
        </div>
        <div className="w-px h-6 bg-gray-200"></div>
        <button
          onClick={handleLogout}
          className="cursor-pointer flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          {!isLoading ? <LogoutIcon /> : <CustomLoader />}

          <span className="ml-2">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default DashboardNavbar;
