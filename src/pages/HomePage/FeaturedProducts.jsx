import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, CreditCard, BadgeCheck, Handshake, Wrench, Truck, Target, Star } from "lucide-react";
import Swal from "sweetalert2";
import { getAllParts } from "../../services/PartsApi";
import { getAllBrands } from "../../services/BrandApi";
import { getBackendImgURL } from "../../utils/helper";

export default function FeaturedProducts() {
    const PRODUCTS_PER_PAGE = 5;
    const [parts, setParts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [page, setPage] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const partsData = await getAllParts();
                const brandsData = await getAllBrands();
                setParts(partsData.slice(0, 10));
                setBrands(brandsData.slice(0, 10));
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
            }
        };
        fetchData();
    }, []);

    const totalPages = Math.max(parts.length - PRODUCTS_PER_PAGE + 1, 1);

    useEffect(() => {
        const timer = setInterval(() => {
            setPage((prev) => (prev + 1) % totalPages);
        }, 4000);
        return () => clearInterval(timer);
    }, [totalPages]);

    const handleAddToCart = (item) => {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const idx = cart.findIndex((i) => i.id === (item.id || item._id || item.name));
        if (idx >= 0) {
            cart[idx].quantity += 1;
        } else {
            cart.push({ ...item, id: item.id || item._id || item.name, quantity: 1 });
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        window.dispatchEvent(new Event("cartChanged"));
        Swal.fire({
            icon: "success",
            title: "Đã thêm vào giỏ hàng!",
            showConfirmButton: false,
            timer: 1200,
            timerProgressBar: true,
        });
    };

    const handleBuy = (item) => {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const idx = cart.findIndex((i) => i.id === (item.id || item._id || item.name));
        if (idx >= 0) {
            cart[idx].quantity += 1;
        } else {
            cart.push({ ...item, id: item.id || item._id || item.name, quantity: 1 });
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        window.dispatchEvent(new Event("cartChanged"));
        navigate("/cart");
    };

    const currentProducts = parts.slice(page, page + PRODUCTS_PER_PAGE);

    return (
        <div className="space-y-12">
            {/* Card 1: Sản phẩm nổi bật */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <ShoppingCart className="w-5 h-5 text-white" />
                    </div>
                    Sản phẩm nổi bật
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-5">
                    {currentProducts.map((item) => (
                        <div
                            key={item._id || item.id || item.name}
                            className="flex flex-col bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-300 group transform hover:-translate-y-1 cursor-pointer overflow-hidden"
                            onClick={() => navigate(`/parts/${item._id || item.id}`)}
                        >
                            {/* Image */}
                            <div className="relative bg-white p-4 aspect-square">
                                <img
                                    src={getBackendImgURL(item.image || item.img)}
                                    alt={item.name}
                                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                />
                                {item.quantity <= 0 && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">Hết hàng</span>
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="p-4 flex flex-col flex-1">
                                <span className="text-xs text-blue-600 font-medium mb-1">{item.brandId?.name || "GarageHub"}</span>
                                <h4 className="font-semibold text-gray-800 line-clamp-2 mb-2">{item.name}</h4>

                                {/* Stars */}
                                <div className="flex items-center gap-1 mb-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-3.5 h-3.5 ${star <= Math.round(item.averageRating || 0) ? "text-amber-400 fill-amber-400" : "text-gray-200"}`}
                                        />
                                    ))}
                                    <span className="text-xs text-gray-500 ml-1">({item.reviewCount || 0})</span>
                                </div>

                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-blue-600 font-bold text-lg">
                                        {item.price?.toLocaleString("vi-VN")}₫
                                    </span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${item.quantity > 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                                        {item.quantity > 0 ? `Còn ${item.quantity}` : "Hết"}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            {item.quantity > 0 && (
                                <div className="px-4 pb-4 flex gap-2">
                                    <button
                                        className="flex-1 flex items-center justify-center gap-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-3 py-2 rounded-lg text-sm font-semibold shadow-md transition"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleBuy(item);
                                        }}
                                    >
                                        <CreditCard className="w-4 h-4" /> Mua
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAddToCart(item);
                                        }}
                                        className="flex items-center justify-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg shadow-sm font-medium transition"
                                        title="Thêm giỏ hàng"
                                    >
                                        <ShoppingCart size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Pagination dots */}
                <div className="flex justify-center gap-2 mt-6">
                    {Array.from({ length: totalPages }).map((_, idx) => (
                        <button
                            key={idx}
                            className={`h-2 rounded-full transition-all duration-300 ${page === idx ? "bg-blue-600 w-6" : "bg-gray-300 w-2 hover:bg-gray-400"}`}
                            onClick={() => setPage(idx)}
                            aria-label={`Trang ${idx + 1}`}
                            type="button"
                        />
                    ))}
                </div>
            </div>

            {/* Card 2: Phụ tùng chính hãng */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                        <BadgeCheck className="w-5 h-5 text-white" />
                    </div>
                    Phụ tùng chính hãng
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
                    {brands.map((brand) => (
                        <div
                            key={brand._id || brand.id || brand.name}
                            className="flex flex-col items-center bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-md hover:shadow-xl p-4 transition-all duration-300 transform hover:-translate-y-1 hover:ring-2 hover:ring-blue-300 relative cursor-pointer border border-gray-100"
                            onClick={() => navigate(`/parts?brand=${brand._id}`)}
                            title={`Xem phụ tùng hãng ${brand.name}`}
                        >
                            <BadgeCheck className="absolute top-2 right-2 w-5 h-5 text-green-500" />
                            <div className="w-20 h-20 mb-3 flex items-center justify-center">
                                <img
                                    src={getBackendImgURL(brand.image)}
                                    alt={brand.name}
                                    className="w-full h-full object-contain rounded-xl"
                                />
                            </div>
                            <span className="font-medium text-gray-800 text-center text-sm">{brand.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Card 3: Giới thiệu */}
            <div
                className="rounded-2xl shadow-xl text-white overflow-hidden"
                style={{
                    backgroundImage: "url('/public/about.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    minHeight: "450px",
                    position: "relative",
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-cyan-900/60" />
                <div className="relative z-10 p-6 md:p-12 space-y-5">
                    <h4 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                        Giới thiệu <span className="text-cyan-400">GarageHub</span>
                    </h4>

                    <div className="space-y-4 text-white/90 text-base md:text-lg leading-relaxed max-w-3xl">
                        <p className="flex items-start gap-3">
                            <Wrench className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                            GarageHub là nền tảng cung cấp phụ tùng, phụ kiện xe máy chính hãng, chất lượng cao.
                        </p>
                        <p className="flex items-start gap-3">
                            <Handshake className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                            Hợp tác với nhiều thương hiệu uy tín, đảm bảo nguồn gốc xuất xứ rõ ràng.
                        </p>
                        <p className="flex items-start gap-3">
                            <BadgeCheck className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                            Hỗ trợ tư vấn kỹ thuật tận tâm, chính sách bảo hành minh bạch.
                        </p>
                        <p className="flex items-start gap-3">
                            <Truck className="w-5 h-5 text-orange-400 mt-1 flex-shrink-0" />
                            Giao hàng toàn quốc, đặt hàng nhanh chóng, giá cả cạnh tranh.
                        </p>
                        <p className="flex items-start gap-3">
                            <Target className="w-5 h-5 text-pink-400 mt-1 flex-shrink-0" />
                            GarageHub cam kết đồng hành cùng khách hàng trên mọi hành trình.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}