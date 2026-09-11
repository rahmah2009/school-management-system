import { Outlet } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

function AdminLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <AdminHeader />

        <main style={{ padding: "1rem", flex: 1 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;