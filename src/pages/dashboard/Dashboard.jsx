import React from "react";
import DashboardNavbar from "../../components/dashboard/DashboardNavbar";
import DashboardSidebar from "../../components/dashboard/DashboardSidebar";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-full fixed top-0 z-50">
        <DashboardNavbar />
      </div>
      <DashboardSidebar />
    </div>
  );
}
