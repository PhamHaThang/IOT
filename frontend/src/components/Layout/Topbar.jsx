import { useNavigate } from "react-router-dom";
const Topbar = () => {
    const navigate = useNavigate();
    return (
        <header className="h-20 px-8 flex items-center justify-between bg-surface/50 backdrop-blur-md sticky top-0 z-40">
            <div className="flex-1"></div>

            <div
                className="flex items-center gap-6"
                onClick={() => navigate("/profile")}>
                <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-gray-800">
                            Phạm Hà Thắng
                        </p>
                        <p className="text-xs text-gray-500">Quản trị viên</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm">
                        <img
                            src="https://res.cloudinary.com/drgho551x/image/upload/v1768406202/Image-1_vexue9.png"
                            alt="User"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
