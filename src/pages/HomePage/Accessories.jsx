import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Grid3X3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllParts } from "../../services/PartsApi";
import { getBackendImgURL } from "../../utils/helper";

const ITEMS_PER_ROW = 9;
const ROWS_DEFAULT = 2;
const DEFAULT_ITEMS = ITEMS_PER_ROW * ROWS_DEFAULT;

export default function Accessories() {
    const navigate = useNavigate();
    const [parts, setParts] = useState([]);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        const fetchParts = async () => {
            try {
                const data = await getAllParts();
                setParts(data);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách phụ tùng:", error);
            }
        };
        fetchParts();
    }, []);

    // Lấy danh sách phụ tùng duy nhất theo tên
    const categories = Array.from(
        new Map(parts.map(item => [item.name, { name: item.name, img: item.image }])).values()
    );

    const visibleAccessories = showAll ? categories : categories.slice(0, DEFAULT_ITEMS);

    return (
        <div className="relative bg-white rounded-2xl shadow-xl p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <Grid3X3 className="w-5 h-5 text-white" />
                    </div>
                    Danh mục phụ tùng
                </h2>

                <button
                    onClick={() => navigate("/parts")}
                    className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-cyan-600 transform hover:-translate-y-0.5 transition-all duration-300 text-sm"
                >
                    Xem tất cả →
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-3">
                {visibleAccessories.map((item, idx) => (
                    <div
                        key={idx}
                        className="group flex flex-col items-center justify-center rounded-xl bg-gradient-to-br from-gray-50 to-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer p-3 border border-gray-100 hover:border-blue-300"
                        onClick={() => navigate(`/parts?search=${encodeURIComponent(item.name)}`)}
                        title={`Xem danh sách: ${item.name}`}
                    >
                        <div className="w-14 h-14 flex items-center justify-center mb-2">
                            <img
                                src={getBackendImgURL(item.img)}
                                alt={item.name}
                                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                            />
                        </div>
                        <span
                            className="text-xs font-medium text-gray-700 text-center line-clamp-2 group-hover:text-blue-600 transition-colors"
                            title={item.name}
                        >
                            {item.name}
                        </span>
                    </div>
                ))}
            </div>

            {/* Show more/less button */}
            {categories.length > DEFAULT_ITEMS && (
                <div className="flex justify-center mt-6">
                    <button
                        onClick={() => setShowAll((v) => !v)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 text-sm font-medium transition-colors"
                    >
                        {showAll ? (
                            <>
                                <ChevronUp size={16} />
                                Thu gọn
                            </>
                        ) : (
                            <>
                                <ChevronDown size={16} />
                                Xem thêm ({categories.length - DEFAULT_ITEMS})
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}