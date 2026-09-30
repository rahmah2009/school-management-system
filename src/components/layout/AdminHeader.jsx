import { Menu, Bell } from "lucide-react";

function AdminHeader({ onMenuClick }) {
    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm md:px-8">

            {/* Left side */}
            <div className="flex items-center gap-3">

                {/* Mobile hamburger */}
                <button
                    onClick={onMenuClick}
                    className="rounded-lg p-2 text-green-950 transition hover:bg-green-50 md:hidden"
                    aria-label="Open menu"
                >
                    <Menu size={24} />
                </button>

                {/* Dashboard title */}
                <div>
                    <h2 className="text-lg font-bold text-green-950">
                        Admin Dashboard
                    </h2>

                    <p className="hidden text-sm text-gray-500 sm:block">
                        Manage Greenfield School
                    </p>
                </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">

                {/* School logo/name */}
                <div className="hidden items-center sm:flex">
                    <span className="text-lg font-bold text-green-950">
                        Greenfield School
                    </span>
                </div>

                {/* Notifications */}
                <button
                    className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100"
                    aria-label="Notifications"
                >
                    <Bell size={22} />
                </button>

            </div>
        </header>
    );
}

export default AdminHeader;