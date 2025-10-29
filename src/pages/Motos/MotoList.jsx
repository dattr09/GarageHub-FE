import React, { useEffect, useState } from "react";
import { getAllMotos, deleteMoto } from "../../services/MotoApi";

export default function MotoList() {
    const [motos, setMotos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMotos();
    }, []);

    const fetchMotos = async () => {
        try {
            const response = await getAllMotos();
            setMotos(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách xe máy:", error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa xe này?")) {
            try {
                await deleteMoto(id);
                alert("Xóa xe thành công!");
                fetchMotos(); // Cập nhật danh sách sau khi xóa
            } catch (error) {
                console.error("Lỗi khi xóa xe:", error);
                alert("Xóa xe thất bại!");
            }
        }
    };

    if (loading) {
        return <p>Đang tải danh sách xe...</p>;
    }

    return (
        <div className="max-w-6xl mx-auto mt-12 px-4 md:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center">Danh sách xe máy</h2>
            <table className="w-full text-sm border-collapse">
                <thead>
                    <tr className="text-blue-700 font-semibold border-b">
                        <th className="py-2 text-left">Biển số</th>
                        <th className="text-left">Thương hiệu</th>
                        <th className="text-left">Mẫu xe</th>
                        <th className="text-left">Màu sắc</th>
                        <th className="text-left">Người dùng</th>
                        <th className="text-center">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {motos.map((moto) => (
                        <tr key={moto._id} className="border-b hover:bg-gray-50 transition">
                            <td className="py-2">{moto.licensePlate}</td>
                            <td>{moto.brand?.name || "Không xác định"}</td>
                            <td>{moto.model}</td>
                            <td>{moto.color || "Không xác định"}</td>
                            <td>{moto.owner?.email || "Không xác định"}</td>
                            <td className="text-center">
                                <button
                                    className="text-red-600 hover:underline mr-4"
                                    onClick={() => handleDelete(moto._id)}
                                >
                                    Xóa
                                </button>
                                <button
                                    className="text-blue-600 hover:underline"
                                    onClick={() => alert("Chức năng cập nhật chưa được triển khai!")}
                                >
                                    Cập nhật
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}