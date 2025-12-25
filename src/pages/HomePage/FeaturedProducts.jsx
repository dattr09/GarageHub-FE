import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, CreditCard, BadgeCheck, Handshake, Wrench, Truck, Target } from "lucide-react";
import PartDetails from "../Parts/PartDetails";
import Swal from "sweetalert2";
import { getAllParts } from "../../services/PartsApi"; // Import API lấy danh sách phụ tùng
import { getAllBrands } from "../../services/BrandApi"; // Import API lấy danh sách thương hiệu
import { getBackendImgURL } from "../../utils/helper";

export default function FeaturedProducts() {
    const PRODUCTS_PER_PAGE = 5;
    const [parts, setParts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [page, setPage] = useState(0);
    const [selectedPart, setSelectedPart] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const partsData = await getAllParts(); // Gọi API lấy danh sách phụ tùng
                const brandsData = await getAllBrands(); // Gọi API lấy danh sách thương hiệu
                setParts(partsData.slice(0, 10)); // Lấy 10 phụ tùng đầu tiên
                setBrands(brandsData.slice(0, 10)); // Lấy 10 thương hiệu đầu tiên
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
        const idx = cart.findIndex((i) => i.id === (item.id || item._id || item.name)); // Kiểm tra bằng id, _id hoặc name
        if (idx >= 0) {
            cart[idx].quantity += 1; // Nếu sản phẩm đã tồn tại, tăng số lượng
        } else {
            cart.push({ ...item, id: item.id || item._id || item.name, quantity: 1 }); // Thêm sản phẩm mới
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
        const idx = cart.findIndex((i) => i.id === (item.id || item._id || item.name)); // Kiểm tra bằng id, _id hoặc name
        if (idx >= 0) {
            cart[idx].quantity += 1; // Nếu sản phẩm đã tồn tại, tăng số lượng
        } else {
            cart.push({ ...item, id: item.id || item._id || item.name, quantity: 1 }); // Thêm sản phẩm mới
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        window.dispatchEvent(new Event("cartChanged"));
        navigate("/cart");
    };

    const currentProducts = parts.slice(page, page + PRODUCTS_PER_PAGE);

    return (
        <div className="space-y-12">
            {/* Card 1: Sản phẩm nổi bật */}
            <div className="bg-white/80 rounded-2xl shadow-xl p-6 relative">
                <h3 className="text-xl font-bold mb-6 text-blue-700 flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Sản phẩm nổi bật
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 mb-6">
                    {currentProducts.map((item) => (
                        <div
                            key={item.id || item.name}
                            className="flex flex-col items-center bg-white rounded-3xl shadow-lg hover:shadow-2xl p-5 transition-all duration-300 border border-transparent hover:border-blue-400 group transform hover:-translate-y-1 cursor-pointer"
                            onClick={() => setSelectedPart(item)}
                        >
                            <img
                                src={getBackendImgURL(item.image || item.img)}
                                alt={item.name}
                                className="w-24 h-24 object-contain mb-4 rounded-xl group-hover:scale-105 transition"
                            />
                            <span className="font-semibold text-gray-800 text-center">{item.name}</span>
                            <span className="text-blue-600 font-bold text-lg mt-1">
                                {item.price ? item.price.toLocaleString("vi-VN") + " VND" : ""}
                            </span>
                            <span className="text-xs text-gray-500 mb-4">
                                Còn: {item.quantity ?? item.stock}
                            </span>
                            <div className="flex gap-2 mt-auto flex-nowrap items-center">
                                {item.quantity > 0 ? (
                                    <>
                                        <button
                                            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-800 text-white px-3 py-1.5 rounded-lg text-sm font-semibold shadow-md transition"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleBuy(item);
                                            }}
                                        >
                                            <CreditCard className="w-4 h-4" /> Mua ngay
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddToCart(item);
                                            }}
                                            className="flex items-center gap-1 bg-green-600 hover:bg-green-800 text-white px-3 py-1 rounded-lg shadow font-semibold transition"
                                            title="Thêm giỏ hàng"
                                        >
                                            <ShoppingCart size={16} /> Giỏ hàng
                                        </button>
                                    </>
                                ) : (
                                    <div className="w-full text-center bg-red-100 text-red-700 font-bold rounded-xl py-2 mt-2 shadow-inner border border-red-300 animate-pulse">
                                        Hết hàng
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                {selectedPart && (
                    <PartDetails
                        part={selectedPart}
                        brands={brands}
                        onClose={() => setSelectedPart(null)}
                    />
                )}
                <div className="flex justify-center gap-2 absolute bottom-3 left-1/2 -translate-x-1/2">
                    {Array.from({ length: totalPages }).map((_, idx) => (
                        <button
                            key={idx}
                            className={`w-2 h-2 rounded-full transition-all duration-200 ${page === idx ? "bg-white-600 shadow" : "bg-gray-300 hover:bg-gray-500"
                                }`}
                            onClick={() => setPage(idx)}
                            aria-label={`Trang ${idx + 1}`}
                            type="button"
                        />
                    ))}
                </div>
            </div>

            {/* Card 2: Phụ tùng chính hãng */}
            <div className="bg-white/80 rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold mb-6 text-blue-700 flex items-center gap-2">
                    <BadgeCheck className="w-5 h-5 text-green-600 animate-bounce" />
                    Phụ tùng chính hãng
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                    {brands.map((brand) => (
                        <div
                            key={brand.id || brand.name}
                            className="flex flex-col items-center bg-white rounded-2xl shadow-md hover:shadow-xl p-4 transition-all duration-300 transform hover:-translate-y-1 hover:ring-2 hover:ring-blue-300 relative cursor-pointer"
                            onClick={() => navigate(`/parts?brand=${brand._id}`)}
                            title={`Xem phụ tùng hãng ${brand.name}`}
                        >
                            <BadgeCheck className="absolute top-2 right-2 w-6 h-6 text-green-500 bg-white rounded-full shadow" />
                            <div className="w-20 h-20 mb-2 flex items-center justify-center">
                                <img
                                    src={getBackendImgURL(brand.image)}
                                    alt={brand.name}
                                    className="w-full h-full object-contain rounded-xl transition-transform duration-300 group-hover:scale-110"
                                />
                            </div>
                            <span className="font-medium text-gray-800 text-center">{brand.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Card 3: Giới thiệu */}
            <div
                className="rounded-2xl shadow-xl text-white overflow-hidden font-poppins"
                style={{
                    backgroundImage: "url('/public/about.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    minHeight: "550px",
                    position: "relative",
                }}
            >
                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
                <div className="relative z-10 p-6 md:p-12 space-y-5">
                    <h4 className="text-3xl md:text-4xl font-bold text-yellow-300 drop-shadow-lg animate-fade-in-up">
                        Giới thiệu GarageMaster
                    </h4>

                    <div className="space-y-4 text-white text-base md:text-lg font-medium leading-relaxed">
                        <p className="flex items-start gap-3 animate-fade-in-up">
                            <Wrench className="w-5 h-5 text-blue-300 mt-1" />
                            GarageMaster là nền tảng cung cấp phụ tùng, phụ kiện xe máy chính hãng, chất lượng cao.
                        </p>
                        <p className="flex items-start gap-3 animate-fade-in-up">
                            <Handshake className="w-5 h-5 text-green-300 mt-1" />
                            Hợp tác với nhiều thương hiệu uy tín, đảm bảo nguồn gốc xuất xứ rõ ràng.
                        </p>
                        <p className="flex items-start gap-3 animate-fade-in-up">
                            <BadgeCheck className="w-5 h-5 text-purple-300 mt-1" />
                            Hỗ trợ tư vấn kỹ thuật tận tâm, chính sách bảo hành minh bạch.
                        </p>
                        <p className="flex items-start gap-3 animate-fade-in-up">
                            <Truck className="w-5 h-5 text-orange-300 mt-1" />
                            Giao hàng toàn quốc, đặt hàng nhanh chóng, giá cả cạnh tranh.
                        </p>
                        <p className="flex items-start gap-3 animate-fade-in-up">
                            <Target className="w-5 h-5 text-pink-300 mt-1" />
                            GarageMaster cam kết đồng hành cùng khách hàng trên mọi hành trình.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}