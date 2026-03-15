import { LayoutDashboard, Database, History, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import logo from "../../../public/logo.png";
const Sidebar = () => {
    const navItems = [
        { label: "Dashboard", icon: LayoutDashboard, path: "/" },
        { label: "Sensor Data", icon: Database, path: "/sensor-data" },
        { label: "Action History", icon: History, path: "/action-history" },
        { label: "Profile", icon: User, path: "/profile" },
    ];
    return (
        <aside className="w-64 bg-surface h-screen fixed left-0 top-0 shadow-lg flex flex-col z-50">
            <div className="p-6 flex items-center gap-3 border-b border-gray-100">
                <img src={logo} alt="logo" className="w-10 h-10" />
                <span className="text-xl font-bold text-primary">
                    Smart Garden
                </span>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            clsx(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium",
                                isActive
                                    ? "bg-primary/10 text-primary shadow-sm"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700",
                            )
                        }>
                        <item.icon size={20} />
                        {item.label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
