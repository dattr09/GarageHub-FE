import React, { useEffect, useState } from "react";
import { getAllParts, deletePart } from "../../services/PartsApi";
import { getAllBrands } from "../../services/BrandApi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { Layers, DollarSign, Tag, Archive, Package, XCircle, Edit } from "lucide-react";

const PartsList = () => {
    const [parts, setParts] = useState([]);
    const [brands, setBrands] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const partsData = await getAllParts();
                const brandsData = await getAllBrands();

                // Tạo một map từ brandId -> brandName
                const brandsMap = brandsData.reduce((acc, brand) => {
                    acc[brand._id] = brand.name;
                    return acc;
                }, {});

                setParts(partsData);
                setBrands(brandsMap);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
            }
        };

        fetchData();
    }, []);

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

    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN").format(price);
    };

    return (
        <div className="container mx-auto p-6 bg-gray-50 shadow-lg rounded-lg">
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {parts.map((part) => (
                    <div
                        key={part._id}
                        className="bg-white shadow-md rounded-lg p-4 text-center border border-gray-200 hover:shadow-lg transition h-full flex flex-col justify-between cursor-pointer"
                        onClick={() => navigate(`/parts/${part._id}`)} // Chuyển đến trang chi tiết
                    >
                        <div className="flex justify-center items-center mb-4">
                            <img
                                src={part.image || "https://via.placeholder.com/150"}
                                alt={part.name}
                                className="w-45 h-32 object-cover rounded-lg" // Đặt chiều rộng và chiều cao bằng nhau để tạo hình vuông
                            />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 flex items-center justify-center gap-2">
                                <Tag className="w-4 h-4 text-gray-500" /> {part.name}
                            </h2>
                            <p className="text-gray-600 flex items-center justify-center gap-2">
                                <Layers className="w-4 h-4 text-gray-500" /> Số lượng: {part.quantity}
                            </p>
                            <p className="text-gray-600 flex items-center justify-center gap-2">
                                <DollarSign className="w-4 h-4 text-gray-500" /> Giá bán: {formatPrice(part.price)} VND
                            </p>
                            <p className="text-gray-600 flex items-center justify-center gap-2">
                                <Archive className="w-4 h-4 text-gray-500" /> Đơn vị: {part.unit}
                            </p>
                            <p className="text-gray-600 flex items-center justify-center gap-2">
                                <Tag className="w-4 h-4 text-gray-500" /> Thương hiệu: {part.brandId?.name || "Không xác định"}
                            </p>
                        </div>
                        <div className="flex justify-center gap-2 mt-4">
                            <button
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg shadow-md flex items-center gap-2"
                                onClick={(e) => {
                                    e.stopPropagation(); // Ngăn sự kiện click vào thẻ
                                    navigate(`/parts/edit/${part._id}`); // Chuyển đến trang sửa
                                }}
                            >
                                <Edit className="w-4 h-4" /> Sửa
                            </button>
                            <button
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg shadow-md flex items-center gap-2"
                                onClick={(e) => {
                                    e.stopPropagation(); // Ngăn sự kiện click vào thẻ
                                    handleDelete(part);
                                }}
                            >
                                <XCircle className="w-4 h-4" /> Xóa
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PartsList;