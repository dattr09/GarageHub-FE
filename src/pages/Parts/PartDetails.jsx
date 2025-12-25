import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPartById } from "../../services/PartsApi";
import { Package, Layers, DollarSign, Archive, Tag, Image, Edit } from "lucide-react";
import { getBackendImgURL } from "../../utils/helper";

const PartDetails = () => {
    const { id } = useParams();
    const [part, setPart] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPart = async () => {
            try {
                const data = await getPartById(id);
                setPart(data);
            } catch (error) {
                console.error("Error fetching part details:", error);
            }
        };

        fetchPart();
    }, [id]);

    if (!part) {
        return <p>Loading part details...</p>;
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN").format(price); // Định dạng giá theo kiểu Việt Nam
    };

    return (
        <div className="absolute top-0 left-0 w-full min-h-screen bg-black/40 z-40 flex items-center justify-center p-4 pt-20">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 w-full max-w-2xl">
                {/* Header */}
                <div className="flex flex-col items-center justify-center px-6 py-4 border-b border-gray-100">
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-2">
                        <Package className="text-blue-600 w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-800 text-center">Chi tiết phụ tùng</h3>
                </div>

                {/* Nội dung */}
                <div className="px-6 py-6">
                    {/* Hình ảnh sản phẩm */}
                    <div className="flex justify-center mb-6">
                        <div className="w-48 h-48 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden shadow-md">
                            <img
                                src={getBackendImgURL(part.image)}
                                alt={part.name}
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </div>

                    {/* Thông tin sản phẩm */}
                    <div className="space-y-4 text-center">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center justify-center gap-2">
                            <Tag className="w-5 h-5 text-gray-500" /> {part.name}
                        </h2>
                        <p className="text-gray-600 text-lg flex items-center justify-center gap-2">
                            <Layers className="w-5 h-5 text-gray-500" />
                            <span className="font-medium">Số lượng:</span>
                            <span className="font-semibold">{part.quantity}</span>
                        </p>
                        <p className="text-gray-600 text-lg flex items-center justify-center gap-2">
                            <DollarSign className="w-5 h-5 text-gray-500" />
                            <span className="font-medium">Giá bán:</span>
                            <span className="font-semibold text-green-600">{formatPrice(part.price)} VND</span>
                        </p>
                        <p className="text-gray-600 text-lg flex items-center justify-center gap-2">
                            <Archive className="w-5 h-5 text-gray-500" />
                            <span className="font-medium">Đơn vị:</span>
                            <span className="font-semibold">{part.unit}</span>
                        </p>
                        <p className="text-gray-600 text-lg flex items-center justify-center gap-2">
                            <Tag className="w-5 h-5 text-gray-500" />
                            <span className="font-medium">Thương hiệu:</span>
                            <span className="font-semibold">{part.brandId?.name || "Không xác định"}</span>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6 flex items-center justify-center gap-4 px-6 pb-6">
                    <button
                        type="button"
                        onClick={() => navigate("/parts")}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded-md shadow-sm flex items-center gap-2"
                    >
                        <Image className="w-5 h-5" /> Quay lại
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(`/parts/edit/${id}`)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-md shadow-sm flex items-center gap-2"
                    >
                        <Edit className="w-5 h-5" /> Sửa
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PartDetails;