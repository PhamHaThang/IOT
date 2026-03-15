import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
const MainLayout = () => {
    return (
        <div className="flex min-h-screen bg-bg-light">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col">
                <Topbar />
                <main className="flex-1 p-8 pt-4 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
