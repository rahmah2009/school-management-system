import { useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const token = sessionStorage.getItem("greenfield_admin_token");
    let admin = null;
    try {
        admin = JSON.parse(sessionStorage.getItem("greenfield_admin") || "null");
    } catch {
        admin = null;
    }

    if (!token || !admin) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    if (location.pathname === "/admin/settings" && admin.role !== "super_admin") {
        return <Navigate to="/admin" replace />;
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex min-w-0 flex-1 flex-col">
                <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
                <main className="flex-1 px-4 py-6 md:px-6 lg:px-8">
                    <div className="page-container">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;
