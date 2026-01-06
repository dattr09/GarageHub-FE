import React, { useEffect, useState } from "react";
import { Edit2, ArrowLeft, Tag, Package, Star, ShoppingCart } from "lucide-react";
import { getBrandById } from "../../services/BrandApi";
import { getPartsByBrand } from "../../services/PartsApi";
import { useParams, useNavigate } from "react-router-dom";
import { getBackendImgURL } from "../../utils/helper";

const BrandDetails = () => {
    const { id } = useParams();
    const [brand, setBrand] = useState(null);
    const [parts, setParts] = useState([]);
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
                const partsData = await getPartsByBrand(id);
                setParts(partsData);
            } catch (error) {
                console.error("Error fetching parts:", error);
            }
        };

        fetchBrand();
        fetchParts();
    }, [id]);

    const formatPrice = (price) => new Intl.NumberFormat("vi-VN").format(price);

    const renderStars = (rating) => (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`w-3 h-3 ${star <= Math.round(rating || 0) ? "text-amber-400 fill-amber-400" : "text-gray-200"}`}
                />
            ))}
        </div>
    );

    if (!brand) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-pulse text-gray-400">Đang tải...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-sky-50">
            <div className="bg-white border-b border-gray-100 sticky top-0 z-20">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate("/brands")}
                        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Quay lại</span>
                    </button>
                    {isAdmin && (
                        <button
                            onClick={() => navigate(`/brands/edit/${id}`)}
                            className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors"
                        >
                            <Edit2 className="w-4 h-4" />
                            Chỉnh sửa
                        </button>
                    )}
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
                    <div className="p-8 flex flex-col md:flex-row items-center gap-8">
                        <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-2xl border border-gray-100 flex items-center justify-center overflow-hidden shadow-lg">
                            <img
                                src={getBackendImgURL(brand.image)}
                                alt={brand.name}
                                className="w-full h-full object-contain p-4"
                            />
                        </div>

                        <div className="text-center md:text-left">
                            <p className="text-blue-600 font-medium text-sm uppercase tracking-wide mb-2">Thương hiệu</p>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{brand.name}</h1>
                            <p className="text-gray-500">{parts.length} phụ tùng</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Package className="w-5 h-5 text-blue-500" />
                        Phụ tùng thuộc thương hiệu
                    </h3>

                    {parts.length === 0 ? (
                        <div className="text-center py-12">
                            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">Chưa có phụ tùng nào</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {parts.map((part) => (
                                <div
                                    key={part._id}
                                    className="group bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all overflow-hidden cursor-pointer"
                                    onClick={() => navigate(`/parts/${part._id}`)}
                                >
                                    <div className="aspect-square bg-white p-3 border-b border-gray-50">
                                        <img
                                            src={getBackendImgURL(part.image)}
                                            alt={part.name}
                                            className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                                        />
                                    </div>

                                    <div className="p-3">
                                        <h4 className="font-medium text-gray-800 text-sm line-clamp-2 mb-2">{part.name}</h4>
                                        <div className="flex items-center gap-1.5 mb-2">
                                            {renderStars(part.averageRating)}
                                            <span className="text-xs font-medium text-gray-600">{(part.averageRating || 0).toFixed(1)}</span>
                                            <span className="text-xs text-gray-400">({part.reviewCount || 0} đánh giá)</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-blue-600 font-bold">{formatPrice(part.price)}₫</span>
                                            <span className={`text-xs px-1.5 py-0.5 rounded ${part.quantity > 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                                                {part.quantity > 0 ? "Còn hàng" : "Hết"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BrandDetails;