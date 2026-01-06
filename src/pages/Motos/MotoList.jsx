import { useEffect, useState } from "react";
import { getAllMotos, deleteMoto } from "../../services/MotoApi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Plus, Search, Bike, Grid, List, Edit2, Trash2, Eye, User, Palette } from "lucide-react";

export default function MotoList() {
    const [motos, setMotos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [viewMode, setViewMode] = useState("grid");
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
        } catch (e) {
            console.error("Error checking admin:", e);
        }
    }, []);

    const fetchMotos = async () => {
        setLoading(true);
        try {
            const data = await getAllMotos();
            setMotos(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Lỗi khi lấy danh sách xe:", err);
            Swal.fire({ title: "Lỗi!", text: "Không thể tải danh sách xe.", icon: "error" });
            setMotos([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMotos();
    }, []);

    const handleDelete = (licensePlate) => {
        Swal.fire({
            title: "Xóa xe này?",
            text: `Xe biển số "${licensePlate}" sẽ bị xóa vĩnh viễn`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteMoto(licensePlate);
                    Swal.fire({ title: "Đã xóa!", icon: "success", timer: 1500, showConfirmButton: false });
                    fetchMotos();
                } catch (err) {
                    Swal.fire({ title: "Lỗi!", text: "Xóa thất bại", icon: "error" });
                }
            }
        });
    };

    const filteredMotos = motos.filter((m) =>
        m.licensePlate?.toLowerCase().includes(search.toLowerCase()) ||
        m.model?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-sky-50">
            <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 text-white">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm mb-3">
                            <Bike className="w-7 h-7" />
                        </div>
                        <h1 className="text-3xl font-bold mb-1">Quản Lý Xe Máy</h1>
                        <p className="text-white/80 text-sm">{filteredMotos.length} xe đã đăng ký</p>
                        {isAdmin && (
                            <button
                                onClick={() => navigate("/motos/add")}
                                className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-white text-blue-600 rounded-xl font-semibold hover:bg-white/90 transition-all shadow-lg hover:shadow-xl"
                            >
                                <Plus className="w-5 h-5" />
                                Thêm xe mới
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 -mt-4">
                <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
                    <div className="flex flex-wrap gap-3 items-center justify-between">
                        <div className="flex-1 min-w-[200px] relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm theo biển số, mẫu xe..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>

                        <div className="flex bg-gray-100 rounded-xl p-1">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white shadow text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                <Grid className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white shadow text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                <List className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {loading ? (
                    <div className="text-center py-16">
                        <div className="animate-pulse text-gray-400">Đang tải...</div>
                    </div>
                ) : filteredMotos.length === 0 ? (
                    <div className="text-center py-16">
                        <Bike className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">Không tìm thấy xe nào</p>
                    </div>
                ) : viewMode === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredMotos.map((moto) => (
                            <div
                                key={moto._id || moto.licensePlate}
                                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300"
                            >
                                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 text-white relative">
                                    <div className="text-center">
                                        <p className="text-xs text-white/70 uppercase tracking-wide mb-1">Biển số xe</p>
                                        <h3 className="text-2xl font-bold tracking-wider">{moto.licensePlate}</h3>
                                    </div>
                                    {isAdmin && (
                                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => navigate(`/motos/edit/${moto.licensePlate}`)}
                                                className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center text-white hover:bg-white/30"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(moto.licensePlate)}
                                                className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center text-white hover:bg-red-500"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="p-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <Bike className="w-4 h-4 text-gray-400" />
                                            <div>
                                                <p className="text-xs text-gray-400">Mẫu xe</p>
                                                <p className="font-medium text-gray-800">{moto.model}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Palette className="w-4 h-4 text-gray-400" />
                                            <div>
                                                <p className="text-xs text-gray-400">Màu sắc</p>
                                                <p className="font-medium text-gray-800">{moto.color}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-4 h-4 flex items-center justify-center text-gray-400 text-xs font-bold">B</div>
                                            <div>
                                                <p className="text-xs text-gray-400">Hãng</p>
                                                <p className="font-medium text-gray-800">{moto.brandId?.name || "—"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <User className="w-4 h-4 text-gray-400" />
                                            <div>
                                                <p className="text-xs text-gray-400">Chủ sở hữu</p>
                                                <p className="font-medium text-gray-800 truncate">{moto.userId?.email || "—"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => navigate(`/motos/${moto.licensePlate}`)}
                                        className="w-full mt-4 py-2 bg-gray-50 text-blue-600 font-medium rounded-xl hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Eye className="w-4 h-4" />
                                        Xem chi tiết
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredMotos.map((moto) => (
                            <div
                                key={moto._id || moto.licensePlate}
                                className="group bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all p-4 flex gap-4 items-center"
                            >
                                <div className="w-24 h-16 flex-shrink-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold">
                                    {moto.licensePlate}
                                </div>

                                <div className="flex-1 min-w-0 grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-400">Mẫu xe</p>
                                        <p className="font-medium text-gray-800">{moto.model}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Màu</p>
                                        <p className="font-medium text-gray-800">{moto.color}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Hãng</p>
                                        <p className="font-medium text-gray-800">{moto.brandId?.name || "—"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Chủ xe</p>
                                        <p className="font-medium text-gray-800 truncate">{moto.userId?.email || "—"}</p>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => navigate(`/motos/${moto.licensePlate}`)}
                                        className="px-4 py-2 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-100 transition-all flex items-center gap-2"
                                    >
                                        <Eye className="w-4 h-4" />
                                        Xem
                                    </button>
                                    {isAdmin && (
                                        <>
                                            <button
                                                onClick={() => navigate(`/motos/edit/${moto.licensePlate}`)}
                                                className="px-3 py-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(moto.licensePlate)}
                                                className="px-3 py-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
