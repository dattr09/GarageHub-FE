import React, { useEffect, useState } from "react";
import { getAllParts, deletePart } from "../../services/PartsApi";
import { getAllBrands } from "../../services/BrandApi";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { Star, Plus, Edit2, Trash2, Search, ShoppingCart, Filter, ChevronDown, Package, Grid, List } from "lucide-react";
import { getBackendImgURL } from "../../utils/helper";

const PartsList = () => {
    const [parts, setParts] = useState([]);
    const [filteredParts, setFilteredParts] = useState([]);
    const [brands, setBrands] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedBrand, setSelectedBrand] = useState("");
    const [sortOrder, setSortOrder] = useState("");
    const [viewMode, setViewMode] = useState("grid");
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Check if user is admin
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
        } catch (e) {
            console.error("Error checking admin:", e);
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const partsData = await getAllParts();
                setParts(partsData);
                setFilteredParts(partsData);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const brandsData = await getAllBrands();
                setBrands(brandsData.reduce((obj, b) => ({ ...obj, [b._id]: b }), {}));
            } catch (error) {
                setBrands({});
            }
        };
        fetchBrands();
    }, []);

    useEffect(() => {
        let filtered = parts;

        if (searchTerm) {
            filtered = filtered.filter((part) =>
                part.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedBrand) {
            filtered = filtered.filter(
                (part) =>
                    (typeof part.brandId === "object" ? part.brandId._id : part.brandId) === selectedBrand
            );
        }

        if (sortOrder === "asc") {
            filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortOrder === "desc") {
            filtered = [...filtered].sort((a, b) => b.name.localeCompare(a.name));
        } else if (sortOrder === "priceAsc") {
            filtered = [...filtered].sort((a, b) => a.price - b.price);
        } else if (sortOrder === "priceDesc") {
            filtered = [...filtered].sort((a, b) => b.price - a.price);
        } else if (sortOrder === "ratingDesc") {
            filtered = [...filtered].sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        }

        setFilteredParts(filtered);
    }, [searchTerm, selectedBrand, sortOrder, parts]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const brandFromUrl = params.get("brand");
        const searchFromUrl = params.get("search");
        if (brandFromUrl) setSelectedBrand(brandFromUrl);
        if (searchFromUrl) setSearchTerm(searchFromUrl);
    }, [location.search]);

    const handleDelete = async (part) => {
        Swal.fire({
            title: `Xóa phụ tùng?`,
            text: `"${part.name}" sẽ bị xóa vĩnh viễn`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deletePart(part._id);
                    setParts(parts.filter((p) => p._id !== part._id));
                    Swal.fire({
                        title: "Đã xóa!",
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false,
                    });
                } catch (error) {
                    Swal.fire({ title: "Lỗi!", text: "Không thể xóa", icon: "error" });
                }
            }
        });
    };

    const handleAddToCart = (part) => {
        if (!part.quantity || part.quantity <= 0) {
            Swal.fire({
                icon: "warning",
                title: "Hết hàng!",
                text: "Sản phẩm đã hết hàng",
                timer: 2000,
                showConfirmButton: false,
            });
            return;
        }

        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const idx = cart.findIndex((item) => item.id === (part.id || part._id));

        if (idx >= 0) {
            cart[idx].quantity += 1;
        } else {
            cart.push({ ...part, id: part.id || part._id, quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        window.dispatchEvent(new Event("cartChanged"));

        Swal.fire({
            icon: "success",
            title: "Đã thêm vào giỏ!",
            timer: 1000,
            showConfirmButton: false,
            position: "top-end",
            toast: true,
        });
    };

    const formatPrice = (price) => new Intl.NumberFormat("vi-VN").format(price);

    const renderStars = (rating) => {
        return (
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${star <= Math.round(rating || 0) ? "text-amber-400 fill-amber-400" : "text-gray-200"}`}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-sky-50">
            {/* Hero Header */}
            <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 text-white">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm mb-3">
                            <Package className="w-7 h-7" />
                        </div>
                        <h1 className="text-3xl font-bold mb-1">Phụ Tùng Xe Máy</h1>
                        <p className="text-white/80 text-sm">{filteredParts.length} sản phẩm</p>
                        {isAdmin && (
                            <button
                                onClick={() => navigate("/parts/add")}
                                className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-white text-blue-600 rounded-xl font-semibold hover:bg-white/90 transition-all shadow-lg hover:shadow-xl"
                            >
                                <Plus className="w-5 h-5" />
                                Thêm mới
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="max-w-7xl mx-auto px-4 -mt-4">
                <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
                    <div className="flex flex-wrap gap-3 items-center">
                        {/* Search */}
                        <div className="flex-1 min-w-[200px] relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm phụ tùng..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Brand Filter */}
                        <div className="relative min-w-[160px]">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <select
                                value={selectedBrand}
                                onChange={(e) => setSelectedBrand(e.target.value)}
                                className="w-full pl-9 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                            >
                                <option value="">Tất cả hãng</option>
                                {Object.values(brands).map((brand) => (
                                    <option key={brand._id} value={brand._id}>{brand.name}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>

                        {/* Sort */}
                        <div className="relative min-w-[140px]">
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                            >
                                <option value="">Sắp xếp</option>
                                <option value="ratingDesc">⭐ Đánh giá cao</option>
                                <option value="priceAsc">💰 Giá thấp → cao</option>
                                <option value="priceDesc">💰 Giá cao → thấp</option>
                                <option value="asc">A → Z</option>
                                <option value="desc">Z → A</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>

                        {/* View Mode Toggle */}
                        <div className="flex bg-gray-100 rounded-xl p-1">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white shadow text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                <Grid className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white shadow text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                <List className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                {filteredParts.length === 0 ? (
                    <div className="text-center py-16">
                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm</p>
                    </div>
                ) : viewMode === "grid" ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {filteredParts.map((part) => (
                            <div
                                key={part._id}
                                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300"
                            >
                                {/* Image */}
                                <div
                                    className="relative aspect-square bg-white p-4 cursor-pointer border-b border-gray-50"
                                    onClick={() => navigate(`/parts/${part._id}`)}
                                >
                                    <img
                                        src={getBackendImgURL(part.image)}
                                        alt={part.name}
                                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                    />
                                    {part.quantity <= 0 && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">Hết hàng</span>
                                        </div>
                                    )}
                                    {isAdmin && (
                                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); navigate(`/parts/edit/${part._id}`); }}
                                                className="w-8 h-8 bg-white rounded-lg shadow flex items-center justify-center text-amber-500 hover:bg-amber-50"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDelete(part); }}
                                                className="w-8 h-8 bg-white rounded-lg shadow flex items-center justify-center text-red-500 hover:bg-red-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="p-3">
                                    {/* Brand */}
                                    <p className="text-xs text-blue-600 font-medium mb-1 truncate">
                                        {part.brandId?.name || "GarageHub"}
                                    </p>

                                    {/* Name */}
                                    <h3
                                        className="font-semibold text-gray-800 text-sm line-clamp-2 mb-2 cursor-pointer hover:text-blue-600"
                                        onClick={() => navigate(`/parts/${part._id}`)}
                                    >
                                        {part.name}
                                    </h3>

                                    {/* Rating */}
                                    <div className="flex items-center gap-1.5 mb-2">
                                        {renderStars(part.averageRating)}
                                        <span className="text-xs text-gray-500">
                                            ({part.reviewCount || 0})
                                        </span>
                                    </div>

                                    {/* Price & Stock */}
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-lg font-bold text-blue-600">
                                            {formatPrice(part.price)}₫
                                        </span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${part.quantity > 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                                            {part.quantity > 0 ? `Còn ${part.quantity}` : "Hết"}
                                        </span>
                                    </div>

                                    {/* Add to Cart */}
                                    <button
                                        onClick={() => handleAddToCart(part)}
                                        disabled={part.quantity <= 0}
                                        className="w-full py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-medium rounded-xl hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                                    >
                                        <ShoppingCart className="w-4 h-4" />
                                        Thêm vào giỏ
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    // List View
                    <div className="space-y-3">
                        {filteredParts.map((part) => (
                            <div
                                key={part._id}
                                className="group bg-white rounded-xl border border-gray-100 hover:border-indigo-200 hover:shadow-lg transition-all p-4 flex gap-4"
                            >
                                {/* Image */}
                                <div
                                    className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden cursor-pointer"
                                    onClick={() => navigate(`/parts/${part._id}`)}
                                >
                                    <img src={getBackendImgURL(part.image)} alt={part.name} className="w-full h-full object-contain" />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <h3
                                        className="font-semibold text-gray-800 cursor-pointer hover:text-blue-600 truncate"
                                        onClick={() => navigate(`/parts/${part._id}`)}
                                    >
                                        {part.name}
                                    </h3>
                                    <p className="text-sm text-gray-500">{part.brandId?.name}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        {renderStars(part.averageRating)}
                                        <span className="text-xs text-gray-400">({part.reviewCount || 0} đánh giá)</span>
                                    </div>
                                    <div className="mt-2 flex items-center gap-3">
                                        <span className="text-lg font-bold text-blue-600">{formatPrice(part.price)}₫</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${part.quantity > 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                                            {part.quantity > 0 ? `Còn ${part.quantity}` : "Hết hàng"}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => handleAddToCart(part)}
                                        disabled={part.quantity <= 0}
                                        className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition-all flex items-center gap-2"
                                    >
                                        <ShoppingCart className="w-4 h-4" />
                                        Mua
                                    </button>
                                    {isAdmin && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => navigate(`/parts/edit/${part._id}`)}
                                                className="px-3 py-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(part)}
                                                className="px-3 py-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PartsList;