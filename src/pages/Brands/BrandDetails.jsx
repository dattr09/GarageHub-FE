import React, { useEffect, useState } from "react";
import { Edit, XCircle, Landmark, Package } from "lucide-react";
import { getBrandById } from "../../services/BrandApi";
import { getPartsByBrand } from "../../services/PartsApi";
import { useParams, useNavigate } from "react-router-dom";

const fadeInStyle = `
@keyframes fadeIn {
  0% { opacity: 0; transform: translateY(8px) scale(0.98); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
.animate-fade-in {
  animation: fadeIn 0.28s ease-in-out;
}
`;

const BrandDetails = () => {
    const { id } = useParams();
    const [brand, setBrand] = useState(null);
    const [parts, setParts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBrand = async () => {
            try {
                const data = await getBrandById(id);
                setBrand(data);
            } catch (error) {
                console.error("Error fetching brand details:", error);
            }
        };

        const fetchParts = async () => {
            try {
                const parts = await getPartsByBrand(id);
                setParts(parts);
            } catch (error) {
                console.error("Error fetching parts:", error);
            }
        };

        fetchBrand();
        fetchParts();
    }, [id]);

    if (!brand) {
        return <p>Loading brand details...</p>;
    }

    return (
        <>
            <style>{fadeInStyle}</style>

            {/* Overlay */}
            <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                {/* Card */}
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 w-full max-w-2xl animate-fade-in">
                    {/* Header */}
                    <div className="flex flex-col items-center justify-center px-6 py-4 border-b border-gray-100">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-2">
                            <Landmark className="text-blue-600 w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-800 text-center">
                            Chi tiết thương hiệu
                        </h3>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-6">
                        <div className="flex flex-col items-center">
                            {/* Image */}
                            <div className="w-28 h-28 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden mb-4">
                                <img
                                    src={brand.image || "https://via.placeholder.com/150"}
                                    alt={brand.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Brand Name */}
                            <h2 className="text-lg font-semibold text-gray-800">{brand.name}</h2>
                        </div>

                        {/* Parts List */}
                        <div className="mt-6">
                            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <Package className="w-5 h-5 text-gray-500" /> Phụ tùng thuộc thương hiệu
                            </h4>
                            <div
                                className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4"
                                style={{
                                    scrollbarWidth: "thin",
                                    scrollbarColor: "#cbd5e0 #f7fafc",
                                }}
                            >
                                {parts.length > 0 ? (
                                    <ul className="space-y-4">
                                        {parts.map((part) => (
                                            <li
                                                key={part._id}
                                                className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg shadow"
                                            >
                                                {/* Hiển thị ảnh */}
                                                <div className="w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
                                                    <img
                                                        src={part.image || "https://via.placeholder.com/150"}
                                                        alt={part.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>

                                                {/* Hiển thị tên */}
                                                <h5 className="text-md font-semibold text-gray-800">{part.name}</h5>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-gray-600">Không có phụ tùng nào thuộc thương hiệu này.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex items-center justify-center gap-4 px-6 pb-6">
                        <button
                            type="button"
                            onClick={() => navigate("/brands")}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded-md shadow-sm flex items-center gap-2"
                        >
                            <XCircle className="w-5 h-5" /> Quay lại
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate(`/brands/edit/${id}`)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md flex items-center gap-2 shadow"
                        >
                            <Edit className="w-5 h-5" /> Sửa
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BrandDetails;