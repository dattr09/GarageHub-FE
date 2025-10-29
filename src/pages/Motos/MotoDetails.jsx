import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMotoByLicensePlate } from "../../services/MotoApi";
import { Car, Tag, Palette, User, XCircle, Edit } from "lucide-react";

const MotoDetails = () => {
    const { licensePlate } = useParams();
    const [moto, setMoto] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMoto = async () => {
            try {
                const moto = await getMotoByLicensePlate(licensePlate);
                setMoto(moto);
            } catch (error) {
                console.error("Lỗi khi lấy thông tin xe máy:", error);
            }
        };

        fetchMoto();
    }, [licensePlate]);

    if (!moto) {
        return <p>Đang tải thông tin xe...</p>;
    }

    return (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 w-full max-w-2xl">
                <div className="flex flex-col items-center justify-center px-6 py-4 border-b border-gray-100">
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-2">
                        <Car className="text-blue-600 w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-800 text-center">Chi tiết xe máy</h3>
                </div>

                <div className="px-6 py-6 text-center">
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800 flex items-center justify-center gap-2">
                            <Tag className="w-5 h-5 text-gray-500" /> {moto.model}
                        </h2>
                        <p className="text-gray-600 flex items-center justify-center gap-2">
                            <Tag className="w-5 h-5 text-gray-500" /> <span className="font-medium">Biển số:</span> {moto.licensePlate}
                        </p>
                        <p className="text-gray-600 flex items-center justify-center gap-2">
                            <Palette className="w-5 h-5 text-gray-500" /> <span className="font-medium">Màu sắc:</span> {moto.color}
                        </p>
                        <p className="text-gray-600 flex items-center justify-center gap-2">
                            <Tag className="w-5 h-5 text-gray-500" /> <span className="font-medium">Thương hiệu:</span> {moto.brandId?.name || "Không xác định"}
                        </p>
                        <p className="text-gray-600 flex items-center justify-center gap-2">
                            <User className="w-5 h-5 text-gray-500" /> <span className="font-medium">Người dùng:</span> {moto.userId?.email || "Không xác định"}
                        </p>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-center gap-4 px-6 pb-6">
                    <button
                        type="button"
                        onClick={() => navigate("/motos")}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded-md shadow-sm flex items-center gap-2"
                    >
                        <XCircle className="w-5 h-5" /> Quay lại
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(`/motos/edit/${licensePlate}`)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-md shadow-sm flex items-center gap-2"
                    >
                        <Edit className="w-5 h-5" /> Sửa
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MotoDetails;