import {
  FaUser,
  FaBoxOpen,
  FaChartLine,
  FaTachometerAlt,
} from "react-icons/fa";
import { FcSettings } from "react-icons/fc";
import { NavLink } from "react-router-dom";

const navItems = [
  {
    name: "Dashboard",
    Icon: <FaTachometerAlt className="w-5 h-5" />,
    root: "/dashboard",
  },
  {
    name: "User",
    Icon: <FaUser className="w-5 h-5" />,
    root: "/users-dashboard",
  },
  {
    name: "Product",
    Icon: <FaBoxOpen className="w-5 h-5" />,
    root: "/products-dashboard",
  },
  {
    name: "Soldes",
    Icon: <FaChartLine className="w-5 h-5" />,
    root: "/soldes",
  },
  {
    name: "Settings",
    Icon: <FcSettings className="w-5 h-5" />,
    root: "/soldes",
  },
];

const DashboardSidebar = () => {
  return (
    <aside
      className="fixed top-0 left-0  h-screen w-64 bg-white shadow-xl flex flex-col"
      style={{ paddingTop: "3.5rem" }}
    >
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            className="flex items-center p-3 my-1 transition duration-200 ease-in-out rounded-lg cursor-pointer  bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600"
            key={item.name}
            to={item.root}
          >
            {item.Icon}
            <span className="ml-4 whitespace-nowrap text-sm">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
