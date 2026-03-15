import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/Layout/MainLayout";
import DashboardPage from "./pages/DashboardPage";
import SensorDataPage from "./pages/SensorDataPage";
import ActionHistoryPage from "./pages/ActionHistoryPage";
import ProfilePage from "./pages/ProfilePage";
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<DashboardPage />} />
                    <Route path="sensor-data" element={<SensorDataPage />} />
                    <Route
                        path="action-history"
                        element={<ActionHistoryPage />}
                    />
                    <Route path="profile" element={<ProfilePage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
