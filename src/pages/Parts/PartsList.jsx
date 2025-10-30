import React, { useEffect, useState } from "react";
import { getAllParts, deletePart } from "../../services/PartsApi";
import { getAllBrands } from "../../services/BrandApi";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { Layers, DollarSign, Tag, Archive, Package, XCircle, Edit, Search, ShoppingCart } from "lucide-react";

const PartsList = () => {
    const [parts, setParts] = useState([]);
    const [filteredParts, setFilteredParts] = useState([]);
    const [brands, setBrands] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedBrand, setSelectedBrand] = useState("");
    const [priceRange, setPriceRange] = useState([0, Infinity]);
    const [sortOrder, setSortOrder] = useState(""); // "asc" hoặc "desc"
    const navigate = useNavigate();
    const location = useLocation();

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

    // Lấy danh sách hãng khi load trang
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
        // Lọc danh sách phụ tùng dựa trên các tiêu chí
        let filtered = parts;

        // Lọc theo tên
        if (searchTerm) {
            filtered = filtered.filter((part) =>
                part.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Lọc theo hãng
        if (selectedBrand) {
            filtered = filtered.filter(
                (part) =>
                    (typeof part.brandId === "object"
                        ? part.brandId._id
                        : part.brandId) === selectedBrand
            );
        }

        // Lọc theo giá
        filtered = filtered.filter(
            (part) => part.price >= priceRange[0] && part.price <= priceRange[1]
        );

        // Sắp xếp
        if (sortOrder === "asc") {
            filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortOrder === "desc") {
            filtered = filtered.sort((a, b) => b.name.localeCompare(a.name));
        } else if (sortOrder === "priceAsc") {
            filtered = filtered.sort((a, b) => a.price - b.price);
        } else if (sortOrder === "priceDesc") {
            filtered = filtered.sort((a, b) => b.price - a.price);
        }

        setFilteredParts(filtered);
    }, [searchTerm, selectedBrand, priceRange, sortOrder, parts]);

    const handleDelete = async (part) => {
        Swal.fire({
            title: `Xóa phụ tùng: ${part.name}`,
            text: "Bạn có chắc chắn muốn xóa phụ tùng này?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deletePart(part._id);
                    setParts(parts.filter((p) => p._id !== part._id));
                    Swal.fire({
                        title: "Đã xóa!",
                        text: `Phụ tùng "${part.name}" đã được xóa thành công.`,
                        icon: "success",
                        confirmButtonColor: "#3085d6",
                    });
                } catch (error) {
                    console.error("Error deleting part:", error);
                    Swal.fire({
                        title: "Lỗi!",
                        text: "Xóa phụ tùng thất bại. Vui lòng thử lại.",
                        icon: "error",
                        confirmButtonColor: "#3085d6",
                    });
                }
            }
        });
    };

    const handleAddToCart = (part) => {
        if (!part.quantity || part.quantity <= 0) {
            Swal.fire({
                icon: "warning",
                title: "Hết hàng!",
                text: "Phụ tùng này đã hết hàng, không thể thêm vào giỏ.",
                confirmButtonColor: "#3085d6",
            });
            return;
        }

        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const idx = cart.findIndex((item) => item.id === (part.id || part._id || part.name));

        if (idx >= 0) {
            cart[idx].quantity += 1;
        } else {
            cart.push({ ...part, id: part.id || part._id || part.name, quantity: 1 });
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

    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN").format(price);
    };

    useEffect(() => {
        // Lấy brand từ query string nếu có
        const params = new URLSearchParams(location.search);
        const brandFromUrl = params.get("brand");
        if (brandFromUrl) setSelectedBrand(brandFromUrl);
    }, [location.search]);

    return (
        <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-md max-w-6xl mx-auto mt-6">
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-blue-800 flex items-center justify-center gap-2">
                    <Package className="w-6 h-6 text-blue-600" /> Danh sách phụ tùng
                </h1>
            </div>

            <div className="flex justify-end mb-6">
                <button
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-md flex items-center gap-2"
                    onClick={() => navigate("/parts/add")}
                >
                    <Tag className="w-5 h-5" /> Thêm mới
                </button>
            </div>

            {/* Thanh tìm kiếm và bộ lọc */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {/* Tìm kiếm theo tên */}
                <div className="relative col-span-2">
                    <input
                        type="text"
                        placeholder="Tìm kiếm phụ tùng..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                </div>
                {/* Dropdown lọc theo hãng */}
                <select
                    value={selectedBrand}
                    onChange={e => setSelectedBrand(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    <option value="">Tất cả hãng</option>
                    {Object.values(brands).map(brand => (
                        <option key={brand._id} value={brand._id}>{brand.name}</option>
                    ))}
                </select>
                {/* Dropdown sắp xếp */}
                <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    <option value="">Sắp xếp</option>
                    <option value="asc">Tên: A → Z</option>
                    <option value="desc">Tên: Z → A</option>
                    <option value="priceAsc">Giá: Thấp → Cao</option>
                    <option value="priceDesc">Giá: Cao → Thấp</option>
                </select>
            </div>

            {/* Grid container */}
            <div
                className={`grid gap-4 ${filteredParts.length < 4
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-center"
                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                    }`}
            >
                {filteredParts.map((part) => (
                    <div
                        key={part._id}
                        className="bg-white shadow-md rounded-lg p-3 border border-gray-200 hover:shadow-lg transition transform hover:-translate-y-1 flex flex-col justify-between"
                    >
                        {/* Hình ảnh */}
                        <div className="flex justify-center items-center mb-3">
                            <img
                                src={part.image || "https://via.placeholder.com/150"}
                                alt={part.name}
                                className="w-36 h-26 object-contain rounded-lg bg-white"
                            />
                        </div>

                        {/* Thông tin sản phẩm */}
                        <div className="text-center">
                            <h2
                                className="text-lg font-bold text-blue-600 mb-1 cursor-pointer hover:underline"
                                onClick={() => navigate(`/parts/${part._id}`)}
                            >
                                {part.name}
                            </h2>
                            <p className="text-gray-600 text-sm mb-1">
                                <Layers className="inline-block w-4 h-4 text-gray-500 mr-1" />
                                Số lượng: <span className="font-semibold">{part.quantity}</span>
                            </p>
                            <p className="text-gray-600 text-sm mb-1">
                                <DollarSign className="inline-block w-4 h-4 text-gray-500 mr-1" />
                                Giá bán: <span className="font-semibold text-green-600">{formatPrice(part.price)} VND</span>
                            </p>
                            <p className="text-gray-600 text-sm mb-1">
                                <Archive className="inline-block w-4 h-4 text-gray-500 mr-1" />
                                Đơn vị: <span className="font-semibold">{part.unit}</span>
                            </p>
                            <p className="text-gray-600 text-sm">
                                <Tag className="inline-block w-4 h-4 text-gray-500 mr-1" />
                                Thương hiệu: <span className="font-semibold">{part.brandId?.name || "Không xác định"}</span>
                            </p>
                        </div>

                        {/* Nút hành động */}
                        <div className="flex flex-col items-center gap-2 mt-3">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddToCart(part);
                                }}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg shadow-md flex items-center gap-2 w-full"
                            >
                                <ShoppingCart size={16} /> Thêm vào giỏ hàng
                            </button>
                            <div className="flex justify-center gap-2 w-full">
                                <button
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded-lg shadow-md flex items-center gap-2 w-full"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/parts/edit/${part._id}`);
                                    }}
                                >
                                    <Edit className="w-4 h-4" /> Sửa
                                </button>
                                <button
                                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-lg shadow-md flex items-center gap-2 w-full"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(part);
                                    }}
                                >
                                    <XCircle className="w-4 h-4" /> Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PartsList;