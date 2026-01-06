import React, { useEffect, useState } from "react";
import { getAllBrands, deleteBrand } from "../../services/BrandApi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Edit2, Trash2, Plus, Search, Tag, Grid, List, Eye } from "lucide-react";
import { getBackendImgURL } from "../../utils/helper";

const BrandList = () => {
    const [brands, setBrands] = useState([]);
    const [filteredBrands, setFilteredBrands] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState("grid");
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
        } catch (e) {
            console.error("Error checking admin:", e);
        }
    }, []);

    useEffect(() => {
        fetchBrands();
    }, []);

    useEffect(() => {
        const filtered = brands.filter((brand) =>
            brand.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredBrands(filtered);
    }, [searchTerm, brands]);

    const fetchBrands = async () => {
        setLoading(true);
        try {
            const data = await getAllBrands();
            setBrands(data);
            setFilteredBrands(data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách thương hiệu:", error);
            Swal.fire({ title: "Lỗi!", text: "Không thể tải danh sách thương hiệu.", icon: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (brand) => {
        Swal.fire({
            title: `Xóa thương hiệu?`,
            text: `"${brand.name}" sẽ bị xóa vĩnh viễn`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteBrand(brand._id);
                    setBrands(brands.filter((b) => b._id !== brand._id));
                    Swal.fire({ title: "Đã xóa!", icon: "success", timer: 1500, showConfirmButton: false });
                } catch (error) {
                    Swal.fire({ title: "Lỗi!", text: "Xóa thất bại", icon: "error" });
                }
            }
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-sky-50">
            <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 text-white">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm mb-3">
                            <Tag className="w-7 h-7" />
                        </div>
                        <h1 className="text-3xl font-bold mb-1">Thương Hiệu</h1>
                        <p className="text-white/80 text-sm">{filteredBrands.length} thương hiệu</p>
                        {isAdmin && (
                            <button
                                onClick={() => navigate("/brands/add")}
                                className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-white text-blue-600 rounded-xl font-semibold hover:bg-white/90 transition-all shadow-lg hover:shadow-xl"
                            >
                                <Plus className="w-5 h-5" />
                                Thêm mới
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 -mt-4">
                <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
                    <div className="flex flex-wrap gap-3 items-center justify-between">
                        <div className="flex-1 min-w-[200px] relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm thương hiệu..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>

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

            <div className="max-w-7xl mx-auto px-4 py-6">
                {loading ? (
                    <div className="text-center py-16">
                        <div className="animate-pulse text-gray-400">Đang tải...</div>
                    </div>
                ) : filteredBrands.length === 0 ? (
                    <div className="text-center py-16">
                        <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">Không tìm thấy thương hiệu</p>
                    </div>
                ) : viewMode === "grid" ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {filteredBrands.map((brand) => (
                            <div
                                key={brand._id}
                                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300"
                            >
                                <div
                                    className="relative aspect-square bg-white p-6 cursor-pointer border-b border-gray-50"
                                    onClick={() => navigate(`/brands/${brand._id}`)}
                                >
                                    <img
                                        src={getBackendImgURL(brand.image)}
                                        alt={brand.name}
                                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                    />
                                    {isAdmin && (
                                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); navigate(`/brands/edit/${brand._id}`); }}
                                                className="w-8 h-8 bg-white rounded-lg shadow flex items-center justify-center text-amber-500 hover:bg-amber-50"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDelete(brand); }}
                                                className="w-8 h-8 bg-white rounded-lg shadow flex items-center justify-center text-red-500 hover:bg-red-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="p-4 text-center">
                                    <h3
                                        className="font-semibold text-gray-800 cursor-pointer hover:text-blue-600 transition-colors"
                                        onClick={() => navigate(`/brands/${brand._id}`)}
                                    >
                                        {brand.name}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredBrands.map((brand) => (
                            <div
                                key={brand._id}
                                className="group bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all p-4 flex gap-4 items-center"
                            >
                                <div
                                    className="w-16 h-16 flex-shrink-0 bg-white rounded-xl overflow-hidden cursor-pointer border border-gray-100"
                                    onClick={() => navigate(`/brands/${brand._id}`)}
                                >
                                    <img src={getBackendImgURL(brand.image)} alt={brand.name} className="w-full h-full object-contain" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3
                                        className="font-semibold text-gray-800 cursor-pointer hover:text-blue-600 truncate"
                                        onClick={() => navigate(`/brands/${brand._id}`)}
                                    >
                                        {brand.name}
                                    </h3>
                                    <p className="text-sm text-gray-500">Thương hiệu</p>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => navigate(`/brands/${brand._id}`)}
                                        className="px-4 py-2 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-100 transition-all flex items-center gap-2"
                                    >
                                        <Eye className="w-4 h-4" />
                                        Xem
                                    </button>
                                    {isAdmin && (
                                        <>
                                            <button
                                                onClick={() => navigate(`/brands/edit/${brand._id}`)}
                                                className="px-3 py-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(brand)}
                                                className="px-3 py-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </>
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

export default BrandList;