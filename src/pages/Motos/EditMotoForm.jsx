import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMotoByLicensePlate, updateMoto } from "../../services/MotoApi";
import { getAllBrands } from "../../services/BrandApi";
import { AuthAPI } from "../../services/api";
import { Bike, Tag, Palette, Building2, User, Save, XCircle } from "lucide-react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export default function EditMotoForm() {
    const { licensePlate } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        model: "",
        color: "",
        brandId: "",
        userId: "",
    });

    const [brands, setBrands] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [brandsRes, usersRes, moto] = await Promise.all([
                    getAllBrands(),
                    AuthAPI.getAllUsers(),
                    getMotoByLicensePlate(licensePlate),
                ]);
                const motoData = moto.data || moto;
                setBrands(brandsRes.data || brandsRes);
                setUsers(usersRes.data || usersRes);
                setFormData({
                    model: motoData.model || "",
                    color: motoData.color || "",
                    brandId: motoData.brandId?._id || "",
                    userId: motoData.userId?._id || "",
                });
            } catch (err) {
                console.error("Lỗi khi tải dữ liệu:", err);
                Swal.fire("Lỗi!", "Không thể tải dữ liệu xe.", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [licensePlate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await updateMoto(licensePlate, formData);
            Swal.fire({
                title: "Thành công!",
                text: "Cập nhật xe thành công.",
                icon: "success",
                confirmButtonText: "OK",
            }).then(() => {
                navigate("/motos");
            });
        } catch (err) {
            console.error("Lỗi cập nhật xe:", err);
            Swal.fire("Lỗi!", "Không thể cập nhật xe!", "error");
        } finally {
            setSaving(false);
        }
    };

    if (loading)
        return (
            <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 w-full max-w-2xl flex items-center justify-center p-8">
                    <span className="text-gray-600 text-lg">⏳ Đang tải dữ liệu...</span>
                </div>
            </div>
        );

    return (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 w-full max-w-3xl">
                {/* Header */}
                <div className="flex flex-col items-center justify-center px-6 py-4 border-b border-gray-100">
                    <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-2">
                        <Bike className="text-green-600 w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-800 text-center">
                        Sửa xe máy
                    </h3>
                </div>
                <form onSubmit={handleSubmit} className="px-6 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            disabled={saving}
                            className={`bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-md flex items-center gap-2 shadow ${saving ? "opacity-60 cursor-not-allowed" : ""
                                }`}
                        >
                            <Save className="w-5 h-5" /> {saving ? "Đang lưu..." : "Lưu thay đổi"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
