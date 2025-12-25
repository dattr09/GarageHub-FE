import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMotoByLicensePlate } from "../../services/MotoApi";
import { Bike, User, Tag, Palette, Building2, Image, Edit } from "lucide-react";

export default function MotoDetails() {
    const { licensePlate } = useParams();
    const [moto, setMoto] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMoto = async () => {
            try {
                const data = await getMotoByLicensePlate(licensePlate);
                setMoto(data);
            } catch (err) {
                console.error("❌ Lỗi lấy chi tiết xe:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMoto();
    }, [licensePlate]);

    if (loading)
        return (
            <div className="absolute top-0 left-0 w-full min-h-screen bg-black/40 z-40 flex items-center justify-center p-4 pt-20">
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 w-full max-w-2xl flex items-center justify-center p-8">
                    <span className="text-gray-600 text-lg">⏳ Đang tải thông tin xe...</span>
                </div>
            </div>
        );
    if (!moto)
        return (
            <div className="absolute top-0 left-0 w-full min-h-screen bg-black/40 z-40 flex items-center justify-center p-4 pt-20">
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 w-full max-w-2xl flex items-center justify-center p-8">
                    <span className="text-red-500 text-lg">❌ Không tìm thấy thông tin xe!</span>
                </div>
            </div>
        );

    return (
        <div className="absolute top-0 left-0 w-full min-h-screen bg-black/40 z-40 flex items-center justify-center p-4 pt-20">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 w-full max-w-2xl">
                {/* Header */}
                <div className="flex flex-col items-center justify-center px-6 py-4 border-b border-gray-100">
                    <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-2">
                        <Bike className="text-green-600 w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-800 text-center">
                        Chi tiết xe máy
                    </h3>
                </div>

                {/* Nội dung */}
                <div className="px-6 py-6">
                    <div className="flex justify-center mb-6">
                        <div className="w-48 h-48 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden shadow-md">
                            <img
                                src={
                                    moto.image ||
                                    "https://cdn-icons-png.flaticon.com/512/2972/2972185.png"
                                }
                                alt={moto.licensePlate}
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </div>
                    <div className="space-y-4 text-center">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center justify-center gap-2">
                            <Tag className="w-5 h-5 text-gray-500" /> {moto.licensePlate}
                        </h2>
                        <p className="text-gray-600 text-lg flex items-center justify-center gap-2">
                            <Tag className="w-5 h-5 text-gray-500" />
                            <span className="font-medium">Model:</span>
                            <span className="font-semibold">{moto.model}</span>
                        </p>
                        <p className="text-gray-600 text-lg flex items-center justify-center gap-2">
                            <Palette className="w-5 h-5 text-gray-500" />
                            <span className="font-medium">Màu:</span>
                            <span className="font-semibold">{moto.color}</span>
                        </p>
                        <p className="text-gray-600 text-lg flex items-center justify-center gap-2">
                            <Building2 className="w-5 h-5 text-gray-500" />
                            <span className="font-medium">Hãng:</span>
                            <span className="font-semibold">{moto.brandId?.name || "Không rõ"}</span>
                        </p>
                        <p className="text-gray-600 text-lg flex items-center justify-center gap-2">
                            <User className="w-5 h-5 text-gray-500" />
                            <span className="font-medium">Chủ xe:</span>
                            <span className="font-semibold">{moto.userId?.email || "Không rõ"}</span>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6 flex items-center justify-center gap-4 px-6 pb-6">
                    <button
                        type="button"
                        onClick={() => navigate("/motos")}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded-md shadow-sm flex items-center gap-2"
                    >
                        <Image className="w-5 h-5" /> Quay lại
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(`/motos/edit/${moto.licensePlate}`)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-md shadow-sm flex items-center gap-2"
                    >
                        <Edit className="w-5 h-5" /> Sửa
                    </button>
                </div>
            </div>
        </div>
    );
}