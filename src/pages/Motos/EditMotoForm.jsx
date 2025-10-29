import React, { useState, useEffect } from "react";
import { Save, XCircle, Car, Tag, Palette, User } from "lucide-react";
import { getMotoByLicensePlate, updateMoto } from "../../services/MotoApi";
import { getAllBrands } from "../../services/BrandApi";
import { AuthAPI } from "../../services/api";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const EditMotoForm = () => {
    const { licensePlate } = useParams();
    const navigate = useNavigate();

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

    // Load dữ liệu khi component mount
    useEffect(() => {
        if (licensePlate) {
            fetchMoto();
            fetchBrands();
            fetchUsers();
        }
    }, [licensePlate]);

    // 🔹 Hàm fetch moto theo biển số
    const fetchMoto = async () => {
        try {
            const moto = await getMotoByLicensePlate(licensePlate);
            setFormData({
                licensePlate: moto.licensePlate || "",
                model: moto.model || "",
                color: moto.color || "",
                brandId: moto.brandId?._id || "",
                userId: moto.userId?._id || "",
            });
        } catch (error) {
            console.error("Lỗi khi lấy thông tin xe máy:", error);
            Swal.fire({
                title: "Lỗi!",
                text: "Không thể tải thông tin xe máy.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };

    // 🔹 Fetch brands
    const fetchBrands = async () => {
        try {
            const response = await getAllBrands();
            setBrands(response || []);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách thương hiệu:", error);
        }
    };

    // 🔹 Fetch users
    const fetchUsers = async () => {
        try {
            const response = await AuthAPI.getAllUsers();
            setUsers(response || []);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách người dùng:", error);
        }
    };

    // 🔹 Hàm xử lý thay đổi input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // 🔹 Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateMoto(formData.licensePlate, {
                model: formData.model,
                color: formData.color,
                brandId: formData.brandId,
                userId: formData.userId,
            });
            Swal.fire({
                title: "Thành công!",
                text: "Thông tin xe máy đã được cập nhật.",
                icon: "success",
                confirmButtonText: "OK",
            }).then(() => navigate("/motos"));
        } catch (error) {
            console.error("Lỗi khi cập nhật xe máy:", error);
            Swal.fire({
                title: "Lỗi!",
                text: "Cập nhật xe máy thất bại. Vui lòng thử lại.",
                icon: "error",
                confirmButtonText: "OK",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 w-full max-w-4xl">
                <div className="flex flex-col items-center justify-center px-6 py-4 border-b border-gray-100">
                    <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center mb-2">
                        <Car className="text-yellow-600 w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-800 text-center">
                        Chỉnh sửa xe máy
                    </h3>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Biển số */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Tag className="w-4 h-4 text-gray-500" /> Biển số
                            </label>
                            <input
                                type="text"
                                name="licensePlate"
                                value={formData.licensePlate || ""}
                                onChange={handleChange}
                                placeholder="Nhập biển số"
                                disabled
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-gray-100 cursor-not-allowed"
                            />
                        </div>

                        {/* Thương hiệu */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Tag className="w-4 h-4 text-gray-500" /> Thương hiệu
                            </label>
                            <select
                                name="brandId"
                                value={formData.brandId}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                            >
                                <option value="">Chọn thương hiệu</option>
                                {brands.map((brand) => (
                                    <option key={brand._id} value={brand._id}>
                                        {brand.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Mẫu xe */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Car className="w-4 h-4 text-gray-500" /> Mẫu xe
                            </label>
                            <input
                                type="text"
                                name="model"
                                value={formData.model}
                                onChange={handleChange}
                                placeholder="Nhập mẫu xe"
                                required
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                            />
                        </div>

                        {/* Màu sắc */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Palette className="w-4 h-4 text-gray-500" /> Màu sắc
                            </label>
                            <input
                                type="text"
                                name="color"
                                value={formData.color}
                                onChange={handleChange}
                                placeholder="Nhập màu sắc"
                                required
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                            />
                        </div>

                        {/* Người dùng */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-500" /> Người dùng
                            </label>
                            <select
                                name="userId"
                                value={formData.userId}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                            >
                                <option value="">Chọn người dùng</option>
                                {users.map((user) => (
                                    <option key={user._id} value={user._id}>
                                        {user.fullName} - {user.phoneNumber}
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
                            className={`bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-md flex items-center gap-2 shadow ${loading ? "opacity-60 cursor-not-allowed" : ""
                                }`}
                        >
                            <Save className="w-5 h-5" /> {loading ? "Đang lưu..." : "Cập nhật"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditMotoForm;