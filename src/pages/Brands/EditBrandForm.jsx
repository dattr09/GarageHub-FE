import React, { useState, useEffect } from "react";
import { Save, Edit2, ImagePlus, ArrowLeft, Tag } from "lucide-react";
import { getBrandById, updateBrand } from "../../services/BrandApi";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { getBackendImgURL } from "../../utils/helper";

const EditBrandForm = () => {
    const { id } = useParams();
    const [name, setName] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBrand = async () => {
            try {
                const brand = await getBrandById(id);
                setName(brand.name);
                if (brand.image) {
                    setImagePreview(getBackendImgURL(brand.image));
                }
            } catch (error) {
                console.error("Error fetching brand:", error);
            }
        };
        fetchBrand();
    }, [id]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("name", name);
            if (imageFile) formData.append("image", imageFile);

            await updateBrand(id, formData);

            Swal.fire({
                title: "Cập nhật thành công!",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
            }).then(() => navigate("/brands"));
        } catch (error) {
            Swal.fire({ title: "Lỗi!", text: "Cập nhật thất bại", icon: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-sky-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-400 via-amber-500 to-orange-400 text-white">
                <div className="max-w-2xl mx-auto px-4 py-8">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm mb-3">
                            <Edit2 className="w-7 h-7" />
                        </div>
                        <h1 className="text-3xl font-bold mb-1">Chỉnh Sửa Thương Hiệu</h1>
                        <p className="text-white/80 text-sm">Cập nhật thông tin thương hiệu</p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="max-w-2xl mx-auto px-4 -mt-4 pb-8">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-6 md:p-8">
                        {/* Image Upload */}
                        <div className="flex justify-center mb-8">
                            <label className="cursor-pointer group">
                                <div className={`w-32 h-32 rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-all ${imagePreview ? "border-amber-400" : "border-gray-300 group-hover:border-amber-400"}`}>
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center text-gray-400 group-hover:text-amber-500">
                                            <ImagePlus className="w-10 h-10 mx-auto mb-2" />
                                            <span className="text-xs">Chọn ảnh</span>
                                        </div>
                                    )}
                                </div>
                                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                            </label>
                        </div>

                        {/* Name */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Tag className="w-4 h-4 inline mr-2 text-gray-400" />
                                Tên thương hiệu
                            </label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Nhập tên thương hiệu"
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex items-center justify-center gap-4 pt-6 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => navigate("/brands")}
                                className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Quay lại
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                            >
                                <Save className="w-5 h-5" />
                                {loading ? "Đang lưu..." : "Cập nhật"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditBrandForm;