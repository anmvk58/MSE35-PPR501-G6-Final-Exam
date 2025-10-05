import { Outlet, Link, useLocation } from "react-router-dom";
import { Users, BarChart3, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function Dashboard() {
    const location = useLocation();
    const { user, logout } = useAuth();

    const menuItems = [
        { path: "/students", label: "Students", icon: <Users size={18} /> },
        { path: "/analytics", label: "Analytics", icon: <BarChart3 size={18} /> },
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md p-4 flex flex-col justify-between">
                <div>
                    <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <LayoutDashboard size={24} /> Dashboard
                    </h1>
                    <nav className="flex flex-col space-y-3">
                        <Link to="/students" className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded">
                            <Users size={20} /> Students
                        </Link>
                        <Link to="/analytics" className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded">
                            <BarChart3 size={20} /> Analytics
                        </Link>
                    </nav>
                </div>
                <button className="flex items-center gap-2 p-2 hover:bg-red-100 rounded text-red-500">
                    <LogOut size={20} /> Logout
                </button>
            </aside>

            {/* Main content */}
            <main className="flex-1 p-8">
                <h2 className="text-3xl font-semibold mb-6">Welcome to Student Dashboard</h2>
                <Outlet /> {/* Render các page con */}
            </main>
        </div>
    );
}
