import React, { useEffect, useState } from "react";
import { getAllBrands, deleteBrand } from "../../services/BrandApi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Eye, Edit, Trash2, PlusCircle, ClipboardList, Search } from "lucide-react";
import { getBackendImgURL } from "../../utils/helper";

const BrandList = () => {
    const [brands, setBrands] = useState([]);
    const [filteredBrands, setFilteredBrands] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

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
            Swal.fire({
                title: "Lỗi!",
                text: "Không thể tải danh sách thương hiệu.",
                icon: "error",
                confirmButtonText: "OK",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (brand) => {
        Swal.fire({
            title: `Xóa thương hiệu: ${brand.name}`,
            text: "Bạn có chắc chắn muốn xóa thương hiệu này?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteBrand(brand._id);
                    setBrands(brands.filter((b) => b._id !== brand._id));
                    Swal.fire("Đã xóa!", `Thương hiệu "${brand.name}" đã được xóa.`, "success");
                } catch (error) {
                    console.error("Lỗi khi xóa thương hiệu:", error);
                    Swal.fire("Lỗi!", "Xóa thương hiệu thất bại. Vui lòng thử lại.", "error");
                }
            }
        });
    };

    return (
        <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-md max-w-6xl mx-auto mt-6">
            {/* Tiêu đề */}
            <div className="flex flex-col items-center mb-6">
                <div className="flex items-center gap-2 text-blue-600">
                    <ClipboardList className="w-8 h-8" />
                    <h2 className="text-3xl font-bold text-blue-800">Danh sách thương hiệu</h2>
                </div>
                <p className="text-gray-500 text-sm mt-2">
                    Tổng số thương hiệu: <span className="font-semibold">{filteredBrands.length}</span>
                </p>
            </div>

            {/* Thanh tìm kiếm và nút thêm thương hiệu */}
            <div className="flex justify-end items-center mb-4">
                <button
                    className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition"
                    onClick={() => navigate("/brands/add")}
                >
                    <PlusCircle className="w-5 h-5" />
                    Thêm thương hiệu
                </button>
            </div>

            {/* Thanh tìm kiếm */}
            <div className="relative w-full mb-6">
                <input
                    type="text"
                    placeholder="Tìm kiếm thương hiệu..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-blue-400" />
            </div>

            {/* Bảng danh sách */}
            {loading ? (
                <div className="flex justify-center items-center py-10">
                    <div className="text-gray-500 text-lg">Đang tải dữ liệu...</div>
                </div>
            ) : (
                <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow">
                    <thead>
                        <tr className="bg-gray-200 text-gray-700 text-center">
                            <th className="px-4 py-3">Tên thương hiệu</th>
                            <th className="px-4 py-3">Hình ảnh</th>
                            <th className="px-4 py-3">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBrands.length > 0 ? (
                            filteredBrands.map((brand) => (
                                <tr
                                    key={brand._id}
                                    className="hover:bg-gray-100 transition border-b last:border-none text-center"
                                >
                                    <td className="px-4 py-3">{brand.name}</td>
                                    <td className="px-4 py-3">
                                        <img
                                            src={getBackendImgURL(brand.image)}
                                            alt={brand.name}
                                            className="w-12 h-12 object-cover rounded-lg border mx-auto"
                                        />
                                    </td>
                                    <td className="px-4 py-6 flex items-center justify-center gap-4">
                                        <button
                                            className="text-blue-500 hover:text-blue-700"
                                            onClick={() => navigate(`/brands/${brand._id}`)}
                                        >
                                            <Eye className="w-5 h-5" />
                                        </button>
                                        <button
                                            className="text-yellow-500 hover:text-yellow-700"
                                            onClick={() => navigate(`/brands/edit/${brand._id}`)}
                                        >
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => handleDelete(brand)}
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="text-center py-6 text-gray-500">
                                    Không tìm thấy thương hiệu nào
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default BrandList;