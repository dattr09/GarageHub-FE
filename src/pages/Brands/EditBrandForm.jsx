import React, { useState, useEffect } from "react";
import { Save, XCircle, Landmark, Image } from "lucide-react"; // Thêm icon Image
import { getBrandById, updateBrand } from "../../services/BrandApi";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2
import "sweetalert2/dist/sweetalert2.min.css"; // Import CSS của SweetAlert2

const fadeInStyle = `
@keyframes fadeIn {
  0% { opacity: 0; transform: translateY(8px) scale(0.98); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
.animate-fade-in {
  animation: fadeIn 0.28s ease-in-out;
}
`;

const EditBrandForm = () => {
    const { id } = useParams();
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBrand = async () => {
            try {
                const brand = await getBrandById(id);
                setName(brand.name);
                setImage(brand.image);
            } catch (error) {
                console.error("Error fetching brand:", error);
            }
        };

        fetchBrand();
    }, [id]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result); // Convert file to base64 string
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
            const brandData = { name, image };
            await updateBrand(id, brandData, token);

            // Hiển thị thông báo thành công
            Swal.fire({
                title: "Cập nhật thành công!",
                text: "Thông tin thương hiệu đã được cập nhật.",
                icon: "success",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "OK",
            }).then(() => {
                navigate("/brands"); // Điều hướng về danh sách thương hiệu sau khi đóng thông báo
            });
        } catch (error) {
            console.error("Error updating brand:", error);

            // Hiển thị thông báo lỗi
            Swal.fire({
                title: "Lỗi!",
                text: "Cập nhật thương hiệu thất bại. Vui lòng thử lại.",
                icon: "error",
                confirmButtonColor: "#d33",
                confirmButtonText: "OK",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{fadeInStyle}</style>

            {/* overlay */}
            <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                {/* card-like form */}
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 w-full max-w-2xl animate-fade-in">
                    {/* Header */}
                    <div className="flex flex-col items-center justify-center px-6 py-4 border-b border-gray-100">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-2">
                            <Landmark className="text-blue-600 w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-800 text-center">
                            Chỉnh sửa thương hiệu
                        </h3>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="px-6 py-6">
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            {/* Preview / Avatar */}
                            <div className="flex-none">
                                <div className="w-28 h-28 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
                                    {image ? (
                                        <img
                                            src={image}
                                            alt="preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="text-gray-400 text-sm text-center px-2">
                                            Preview
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Inputs */}
                            <div className="flex-1 w-full">
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <Landmark className="w-5 h-5 text-gray-500" /> Tên thương hiệu
                                </label>
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Tên thương hiệu"
                                    required
                                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                />

                                <label className="block text-sm font-medium text-gray-700 mt-4 mb-2 flex items-center gap-2">
                                    <Image className="w-5 h-5 text-gray-500" /> Chọn ảnh thương hiệu
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-6 flex items-center justify-center gap-4">
                            <button
                                type="button"
                                onClick={() => navigate("/brands")}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded-md shadow-sm flex items-center gap-2"
                            >
                                <XCircle className="w-5 h-5" /> Hủy
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md flex items-center gap-2 shadow ${loading ? "opacity-60 cursor-not-allowed" : ""
                                    }`}
                            >
                                <Save className="w-5 h-5" />
                                {loading ? "Đang lưu..." : "Lưu"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default EditBrandForm;