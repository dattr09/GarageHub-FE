// src/components/motos/AddMotoForm.jsx
import { useState, useEffect } from "react";
import { createMoto } from "../../services/MotoApi";
import { getAllBrands } from "../../services/BrandApi";
import { AuthAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { Bike, Tag, Palette, Building2, User, Image, Save, XCircle } from "lucide-react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export default function AddMotoForm() {
    const [formData, setFormData] = useState({
        licensePlate: "",
        model: "",
        color: "",
        brandId: "",
        userId: "",
        image: "",
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
                console.error("❌ Lỗi khi lấy danh sách hãng:", err);
            }
        };
        const fetchUsers = async () => {
            try {
                const res = await AuthAPI.getAllUsers();
                setUsers(res.data || res);
            } catch (err) {
                console.error("❌ Lỗi khi lấy danh sách người dùng:", err);
            }
        };
        fetchBrands();
        fetchUsers();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setFormData((prev) => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createMoto(formData);
            Swal.fire({
                title: "Thành công!",
                text: "Xe đã được thêm vào danh sách.",
                icon: "success",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "OK",
            }).then(() => {
                navigate("/motos");
            });
        } catch (err) {
            console.error("❌ Lỗi thêm xe:", err);
            Swal.fire({
                title: "Lỗi!",
                text: "Không thể thêm xe!",
                icon: "error",
                confirmButtonColor: "#d33",
                confirmButtonText: "OK",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 w-full max-w-3xl">
                {/* Header */}
                <div className="flex flex-col items-center justify-center px-6 py-4 border-b border-gray-100">
                    <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-2">
                        <Bike className="text-green-600 w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-800 text-center">Thêm xe máy</h3>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Biển số xe */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Tag className="w-4 h-4 text-gray-500" /> Biển số xe
                            </label>
                            <input
                                name="licensePlate"
                                placeholder="Biển số xe"
                                value={formData.licensePlate}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                            />
                        </div>
                        {/* Model */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Tag className="w-4 h-4 text-gray-500" /> Model
                            </label>
                            <input
                                name="model"
                                placeholder="Mẫu xe"
                                value={formData.model}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                            />
                        </div>
                        {/* Màu xe */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Palette className="w-4 h-4 text-gray-500" /> Màu xe
                            </label>
                            <input
                                name="color"
                                placeholder="Màu xe"
                                value={formData.color}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                            />
                        </div>
                        {/* Hãng xe */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-gray-500" /> Hãng xe
                            </label>
                            <select
                                name="brandId"
                                value={formData.brandId}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                            >
                                <option value="">Chọn hãng xe</option>
                                {brands.map((b) => (
                                    <option key={b._id} value={b._id}>
                                        {b.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* Người sở hữu */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-500" /> Người sở hữu
                            </label>
                            <select
                                name="userId"
                                value={formData.userId}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                            >
                                <option value="">Chọn người sở hữu</option>
                                {users.map((u) => (
                                    <option key={u._id} value={u._id}>
                                        {u.fullName} ({u.phoneNumber || "Không có số điện thoại"})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="mt-6 flex items-center justify-center gap-4">
                        <button
                            type="button"
                            onClick={() => navigate("/motos")}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded-md shadow-sm flex items-center gap-2"
                        >
                            <XCircle className="w-5 h-5" /> Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md flex items-center gap-2 shadow ${loading ? "opacity-60 cursor-not-allowed" : ""
                                }`}
                        >
                            <Save className="w-5 h-5" /> {loading ? "Đang lưu..." : "Lưu"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
