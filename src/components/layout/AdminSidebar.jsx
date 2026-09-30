import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  School,
  ClipboardList,
  Settings,
  CalendarDays,
  X,
} from "lucide-react";

function AdminSidebar({ isOpen, onClose }) {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Students",
      path: "/admin/students",
      icon: Users,
    },
    {
      name: "Teachers",
      path: "/admin/teachers",
      icon: GraduationCap,
    },
    {
      name: "Classes",
      path: "/admin/classes",
      icon: School,
    },
    {
      name: "Sessions",
      path: "/admin/sessions",
      icon: CalendarDays,
    },
    {
      name: "Results",
      path: "/admin/results",
      icon: ClipboardList,
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
                    fixed inset-y-0 left-0 z-50 w-64
                    bg-green-950 text-white
                    transition-transform duration-300
                    md:static md:z-auto md:min-h-screen
                    md:translate-x-0
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                `}
      >
        {/* School name */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-6">
          <div>
            <h1 className="text-xl font-bold text-yellow-400">
              Greenfield School
            </h1>

            <p className="mt-1 text-sm text-green-200">
              Admin Panel
            </p>
          </div>

          {/* Close button — mobile only */}
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-green-100 hover:bg-white/10 md:hidden"
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    end={item.path === "/admin"}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition ${isActive
                        ? "bg-yellow-400 text-green-950"
                        : "text-green-100 hover:bg-white/10 hover:text-white"
                      }`
                    }
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}

export default AdminSidebar;