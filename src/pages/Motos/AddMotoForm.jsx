import { useState, useEffect } from "react";
import { createMoto } from "../../services/MotoApi";
import { getAllBrands } from "../../services/BrandApi";
import { AuthAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { Bike, Tag, Palette, Building2, User, Save, ArrowLeft } from "lucide-react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export default function AddMotoForm() {
    const [formData, setFormData] = useState({
        licensePlate: "",
        model: "",
        color: "",
        brandId: "",
        userId: "",
    });
    const [brands, setBrands] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const res = await getAllBrands();
                setBrands(res.data || res);
            } catch (err) {
                console.error("Lỗi khi lấy danh sách hãng:", err);
            }
        };
        const fetchUsers = async () => {
            try {
                const res = await AuthAPI.getAllUsers();
                setUsers(res.data || res);
            } catch (err) {
                console.error("Lỗi khi lấy danh sách người dùng:", err);
            }
        };
        fetchBrands();
        fetchUsers();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createMoto(formData);
            Swal.fire({
                title: "Thêm thành công!",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
            }).then(() => navigate("/motos"));
        } catch (err) {
            Swal.fire({ title: "Lỗi!", text: "Không thể thêm xe!", icon: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-sky-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 text-white">
                <div className="max-w-3xl mx-auto px-4 py-8">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm mb-3">
                            <Bike className="w-7 h-7" />
                        </div>
                        <h1 className="text-3xl font-bold mb-1">Thêm Xe Máy Mới</h1>
                        <p className="text-white/80 text-sm">Đăng ký xe vào hệ thống</p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="max-w-3xl mx-auto px-4 -mt-4 pb-8">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-6 md:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Biển số */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Tag className="w-4 h-4 inline mr-2 text-gray-400" />
                                    Biển số xe
                                </label>
                                <input
                                    name="licensePlate"
                                    placeholder="VD: 59F1-12345"
                                    value={formData.licensePlate}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all uppercase font-mono text-lg"
                                />
                            </div>

                            {/* Model */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Bike className="w-4 h-4 inline mr-2 text-gray-400" />
                                    Mẫu xe
                                </label>
                                <input
                                    name="model"
                                    placeholder="VD: Wave Alpha, Vision..."
                                    value={formData.model}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </div>

                            {/* Màu xe */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Palette className="w-4 h-4 inline mr-2 text-gray-400" />
                                    Màu xe
                                </label>
                                <input
                                    name="color"
                                    placeholder="VD: Đỏ, Đen, Trắng..."
                                    value={formData.color}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </div>

                            {/* Hãng xe */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Building2 className="w-4 h-4 inline mr-2 text-gray-400" />
                                    Hãng xe
                                </label>
                                <select
                                    name="brandId"
                                    value={formData.brandId}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                >
                                    <option value="">Chọn hãng xe</option>
                                    {brands.map((b) => (
                                        <option key={b._id} value={b._id}>{b.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Chủ xe */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <User className="w-4 h-4 inline mr-2 text-gray-400" />
                                    Chủ sở hữu
                                </label>
                                <select
                                    name="userId"
                                    value={formData.userId}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                >
                                    <option value="">Chọn chủ xe</option>
                                    {users.map((u) => (
                                        <option key={u._id} value={u._id}>
                                            {u.fullName} ({u.phoneNumber || u.email})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => navigate("/motos")}
                                className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Quay lại
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                            >
                                <Save className="w-5 h-5" />
                                {loading ? "Đang lưu..." : "Lưu xe"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
