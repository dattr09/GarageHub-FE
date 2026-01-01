import React, { useState, useEffect } from "react";
import { Save, XCircle, Package, DollarSign, Layers, Tag, Archive, ImagePlus, ArrowLeft } from "lucide-react";
import { createPart } from "../../services/PartsApi";
import { getAllBrands } from "../../services/BrandApi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const AddPartForm = () => {
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [price, setPrice] = useState("");
    const [buyPrice, setBuyPrice] = useState("");
    const [empPrice, setEmpPrice] = useState("");
    const [unit, setUnit] = useState("");
    const [limitStock, setLimitStock] = useState(0);
    const [brandId, setBrandId] = useState("");
    const [brands, setBrands] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (!user) {
            navigate("/login");
        }
    }, [navigate]);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const data = await getAllBrands();
                setBrands(data);
            } catch (error) {
                console.error("Error fetching brands:", error);
            }
        };
        fetchBrands();
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const validatePrices = () => {
        const buy = Number(buyPrice);
        const emp = Number(empPrice);
        const sell = Number(price);

        if (buy > emp || emp > sell) {
            Swal.fire({
                title: "Lỗi giá trị!",
                text: "Giá nhập ≤ Giá nhân viên ≤ Giá bán",
                icon: "error",
            });
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validatePrices()) return;

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("quantity", quantity);
            formData.append("price", price);
            formData.append("buyPrice", buyPrice);
            formData.append("empPrice", empPrice);
            formData.append("unit", unit);
            formData.append("limitStock", limitStock);
            formData.append("brandId", brandId);
            if (imageFile) formData.append("image", imageFile);

            await createPart(formData);

            Swal.fire({
                title: "Thêm thành công!",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
            }).then(() => navigate("/parts"));
        } catch (error) {
            Swal.fire({ title: "Lỗi!", text: "Thêm thất bại", icon: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-sky-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 text-white">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm mb-3">
                            <Package className="w-7 h-7" />
                        </div>
                        <h1 className="text-3xl font-bold mb-1">Thêm Phụ Tùng Mới</h1>
                        <p className="text-white/80 text-sm">Điền thông tin sản phẩm bên dưới</p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="max-w-4xl mx-auto px-4 -mt-4 pb-8">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-6 md:p-8">
                        {/* Image Upload */}
                        <div className="flex justify-center mb-8">
                            <label className="cursor-pointer group">
                                <div className={`w-36 h-36 rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-all ${imagePreview ? "border-blue-400" : "border-gray-300 group-hover:border-blue-400"}`}>
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center text-gray-400 group-hover:text-blue-500">
                                            <ImagePlus className="w-10 h-10 mx-auto mb-2" />
                                            <span className="text-xs">Chọn ảnh</span>
                                        </div>
                                    )}
                                </div>
                                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                            </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {/* Tên */}
                            <div className="md:col-span-2 lg:col-span-3">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Tag className="w-4 h-4 inline mr-2 text-gray-400" />
                                    Tên phụ tùng
                                </label>
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Nhập tên phụ tùng"
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>

                            {/* Giá nhập */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <DollarSign className="w-4 h-4 inline mr-2 text-gray-400" />
                                    Giá nhập
                                </label>
                                <input
                                    type="number"
                                    value={buyPrice}
                                    onChange={(e) => setBuyPrice(e.target.value)}
                                    placeholder="0"
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </div>

                            {/* Giá nhân viên */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <DollarSign className="w-4 h-4 inline mr-2 text-gray-400" />
                                    Giá nhân viên
                                </label>
                                <input
                                    type="number"
                                    value={empPrice}
                                    onChange={(e) => setEmpPrice(e.target.value)}
                                    placeholder="0"
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </div>

                            {/* Giá bán */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <DollarSign className="w-4 h-4 inline mr-2 text-green-500" />
                                    Giá bán
                                </label>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="0"
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </div>

                            {/* Số lượng */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Layers className="w-4 h-4 inline mr-2 text-gray-400" />
                                    Số lượng
                                </label>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    placeholder="0"
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </div>

                            {/* Đơn vị */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Archive className="w-4 h-4 inline mr-2 text-gray-400" />
                                    Đơn vị
                                </label>
                                <input
                                    value={unit}
                                    onChange={(e) => setUnit(e.target.value)}
                                    placeholder="cái, bộ, lít..."
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </div>

                            {/* Giới hạn tồn kho */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Layers className="w-4 h-4 inline mr-2 text-gray-400" />
                                    Tồn kho tối thiểu
                                </label>
                                <input
                                    type="number"
                                    value={limitStock}
                                    onChange={(e) => setLimitStock(e.target.value)}
                                    placeholder="0"
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </div>

                            {/* Thương hiệu */}
                            <div className="md:col-span-2 lg:col-span-3">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Tag className="w-4 h-4 inline mr-2 text-gray-400" />
                                    Thương hiệu
                                </label>
                                <select
                                    value={brandId}
                                    onChange={(e) => setBrandId(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                >
                                    <option value="">Chọn thương hiệu</option>
                                    {brands.map((brand) => (
                                        <option key={brand._id} value={brand._id}>{brand.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => navigate("/parts")}
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
                                {loading ? "Đang lưu..." : "Lưu phụ tùng"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddPartForm;