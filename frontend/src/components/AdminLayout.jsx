import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function AdminLayout() {
  const isAuthenticated = !!localStorage.getItem("access_token");
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-glowup-bg font-inter">
      <Sidebar />
      <main className="flex-1 ml-[280px] min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
