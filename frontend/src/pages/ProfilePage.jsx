import { User, FileText, Github, Figma, Mail } from "lucide-react";
const ProfilePage = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8 text-center">
                <div className="w-48 h-48 mx-auto bg-gray-200 rounded-full overflow-hidden border-4 border-white shadow-lg mb-6">
                    <img
                        src="https://res.cloudinary.com/drgho551x/image/upload/v1768406202/Image-1_vexue9.png"
                        alt="Profile"
                        className="w-full h-full object-cover"
                    />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                    Phạm Hà Thắng
                </h2>
                <p className="text-gray-500">Quản trị viên</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <User size={20} className="text-primary" />
                        Thông tin cá nhân
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between py-2 border-b border-gray-50">
                            <span className="text-gray-500">Họ tên</span>
                            <span className="font-medium text-gray-800">
                                Phạm Hà Thắng
                            </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-50">
                            <span className="text-gray-500">Mã sinh viên</span>
                            <span className="font-medium text-gray-800">
                                B22DCPT261
                            </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-50">
                            <span className="text-gray-500">Email</span>
                            <span className="font-medium text-gray-800">
                                hathang2004@gmail.com
                            </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-50">
                            <span className="text-gray-500">Vai trò</span>
                            <span className="font-medium text-gray-800">
                                Quản trị viên
                            </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-50">
                            <span className="text-gray-500">Tham gia</span>
                            <span className="font-medium text-gray-800">
                                01/01/2026
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <FileText size={20} className="text-blue-500" />
                        Tài liệu & Liên kết
                    </h3>
                    <div className="space-y-3">
                        <a
                            href="#"
                            target="_blank"
                            className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-red-500 group-hover:scale-110 transition-transform">
                                <FileText size={20} />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-800">
                                    Báo cáo dự án (PDF)
                                </h4>
                                <p className="text-xs text-gray-500">
                                    View document
                                </p>
                            </div>
                        </a>
                        <a
                            href="https://www.figma.com/design/jPNpthUbWmQJiScroKbilk/IOT?node-id=19-288&t=aZzu0zamotlIS9xV-1"
                            target="_blank"
                            className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-purple-600 group-hover:scale-110 transition-transform">
                                <Figma size={20} />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-800">
                                    Figma Design
                                </h4>
                                <p className="text-xs text-gray-500">
                                    View prototype
                                </p>
                            </div>
                        </a>
                        <a
                            href="https://github.com/PhamHaThang/IOT"
                            target="_blank"
                            className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-gray-800 group-hover:scale-110 transition-transform">
                                <Github size={20} />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-800">
                                    Source Code
                                </h4>
                                <p className="text-xs text-gray-500">
                                    View on GitHub
                                </p>
                            </div>
                        </a>
                        <a
                            href="#"
                            target="_blank"
                            className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-green-600 group-hover:scale-110 transition-transform">
                                <Mail size={20} />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-800">
                                    API Documentation
                                </h4>
                                <p className="text-xs text-gray-500">
                                    Postman / Swagger
                                </p>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
