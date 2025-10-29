import React, { useEffect, useState } from "react";
import { getAllBrands, deleteBrand } from "../../services/BrandApi";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus, FaCar } from "react-icons/fa";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const BrandList = () => {
    const [brands, setBrands] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const data = await getAllBrands();
                setBrands(data);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách thương hiệu:", error);
            }
        };

        fetchBrands();
    }, []);

    const handleDelete = async (brand) => {
        Swal.fire({
            title: `Xóa thương hiệu: ${brand.name}`,
            html: `
            <div style="display: flex; flex-direction: column; align-items: center;">
                <img src="${brand.image || "https://via.placeholder.com/300"}" alt="${brand.name}" 
                    style="width: 150px; height: 150px; object-fit: cover; border-radius: 8px; margin-bottom: 10px;" />
                <p>Bạn có chắc chắn muốn xóa thương hiệu này?</p>
            </div>
        `,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteBrand(brand._id, localStorage.getItem("token"));
                    setBrands(brands.filter((b) => b._id !== brand._id));

                    Swal.fire({
                        title: "Đã xóa!",
                        text: `Thương hiệu "${brand.name}" đã được xóa thành công.`,
                        icon: "success",
                        confirmButtonColor: "#3085d6",
                    });
                } catch (error) {
                    console.error("Lỗi khi xóa thương hiệu:", error);

                    Swal.fire({
                        title: "Lỗi!",
                        text: "Xóa thương hiệu thất bại. Vui lòng thử lại.",
                        icon: "error",
                        confirmButtonColor: "#3085d6",
                    });
                }
            }
        });
    };

    return (
        <div className="container mx-auto p-6 bg-gray-50 shadow-lg rounded-lg">
            {/* Title Section */}
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
                    <FaCar className="text-blue-500" /> Danh sách thương hiệu
                </h1>
            </div>

            {/* Add Button */}
            <div className="flex justify-end mb-6">
                <button
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-md"
                    onClick={() => navigate("/brands/add")}
                >
                    <FaPlus /> Thêm mới
                </button>
            </div>

            {/* Total Brands */}
            <div className="mb-4 text-gray-600 text-lg text-center">
                Tổng số thương hiệu:{" "}
                <span className="font-bold text-gray-800">{brands.length}</span>
            </div>

            {/* Brand Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
                {brands.map((brand) => (
                    <div
                        key={brand._id}
                        className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center border border-gray-200 hover:shadow-xl transition w-full max-w-xs cursor-pointer"
                        onClick={() => navigate(`/brands/${brand._id}`)} // Điều hướng đến trang chi tiết
                    >
                        {/* Brand Image */}
                        <img
                            src={brand.image || "https://via.placeholder.com/150"}
                            alt={brand.name}
                            className="w-45 h-32 object-cover rounded-lg mb-4 border border-gray-300" // Đặt chiều rộng và chiều cao bằng nhau
                        />
                        {/* Brand Name */}
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                            {brand.name}
                        </h2>
                        {/* Action Buttons */}
                        <div className="flex gap-4 mt-4">
                            <button
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md"
                                onClick={(e) => {
                                    e.stopPropagation(); // Ngăn điều hướng khi bấm nút
                                    navigate(`/brands/edit/${brand._id}`);
                                }}
                            >
                                <FaEdit /> Sửa
                            </button>
                            <button
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md"
                                onClick={(e) => {
                                    e.stopPropagation(); // Ngăn điều hướng khi bấm nút
                                    handleDelete(brand);
                                }}
                            >
                                <FaTrash /> Xóa
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* No Brands Message */}
            {brands.length === 0 && (
                <div className="text-center text-gray-500 mt-10">
                    Không có thương hiệu nào. Nhấn "Thêm mới" để tạo mới.
                </div>
            )}
        </div>
    );
};

export default BrandList;