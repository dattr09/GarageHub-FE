import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMotoByLicensePlate } from "../../services/MotoApi";
import { Bike, User, Tag, Palette, Building2, Edit2, ArrowLeft, Phone, Mail } from "lucide-react";

export default function MotoDetails() {
    const { licensePlate } = useParams();
    const [moto, setMoto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const userStr = localStorage.getItem("user");
            if (userStr) {
                const user = JSON.parse(userStr);
                const adminCheck =
                    (Array.isArray(user.roles) && (user.roles.includes("admin") || user.roles.includes("ADMIN"))) ||
                    user.role === "admin" ||
                    user.role === "ADMIN" ||
                    user.isAdmin === true;
                setIsAdmin(adminCheck);
            }
        } catch (e) { }
    }, []);

    useEffect(() => {
        const fetchMoto = async () => {
            try {
                const data = await getMotoByLicensePlate(licensePlate);
                setMoto(data);
            } catch (err) {
                console.error("Lỗi lấy chi tiết xe:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMoto();
    }, [licensePlate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-pulse text-gray-400">Đang tải...</div>
            </div>
        );
    }

    if (!moto) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Bike className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Không tìm thấy thông tin xe</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-sky-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-20">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate("/motos")}
                        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Quay lại</span>
                    </button>
                    {isAdmin && (
                        <button
                            onClick={() => navigate(`/motos/edit/${moto.licensePlate}`)}
                            className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors"
                        >
                            <Edit2 className="w-4 h-4" />
                            Chỉnh sửa
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    {/* License Plate Hero */}
                    <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 p-8 text-white text-center">
                        <p className="text-white/70 text-sm uppercase tracking-wider mb-2">Biển số xe</p>
                        <h1 className="text-5xl font-bold tracking-widest">{moto.licensePlate}</h1>
                    </div>

                    {/* Info Grid */}
                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Model */}
                            <div className="bg-gray-50 rounded-2xl p-5 flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <Bike className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Mẫu xe</p>
                                    <p className="text-lg font-semibold text-gray-800">{moto.model}</p>
                                </div>
                            </div>

                            {/* Color */}
                            <div className="bg-gray-50 rounded-2xl p-5 flex items-center gap-4">
                                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                                    <Palette className="w-6 h-6 text-pink-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Màu sắc</p>
                                    <p className="text-lg font-semibold text-gray-800">{moto.color || "—"}</p>
                                </div>
                            </div>

                            {/* Brand */}
                            <div className="bg-gray-50 rounded-2xl p-5 flex items-center gap-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                    <Building2 className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Hãng xe</p>
                                    <p className="text-lg font-semibold text-gray-800">{moto.brandId?.name || "—"}</p>
                                </div>
                            </div>

                            {/* Owner */}
                            <div className="bg-gray-50 rounded-2xl p-5 flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                    <User className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Chủ sở hữu</p>
                                    <p className="text-lg font-semibold text-gray-800">{moto.userId?.fullName || "—"}</p>
                                    {moto.userId?.email && (
                                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                            <Mail className="w-3 h-3" />
                                            {moto.userId.email}
                                        </p>
                                    )}
                                    {moto.userId?.phoneNumber && (
                                        <p className="text-sm text-gray-500 flex items-center gap-1">
                                            <Phone className="w-3 h-3" />
                                            {moto.userId.phoneNumber}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}