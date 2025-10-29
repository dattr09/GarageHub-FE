import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Settings2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllParts } from "../../services/PartsApi"; // Import API lấy danh sách phụ tùng

const ITEMS_PER_ROW = 9;
const ROWS_DEFAULT = 2;
const DEFAULT_ITEMS = ITEMS_PER_ROW * ROWS_DEFAULT;

export default function Accessories() {
    const navigate = useNavigate();
    const [parts, setParts] = useState([]); // State để lưu danh sách phụ tùng
    const [showAll, setShowAll] = useState(false);

    // Gọi API để lấy danh sách phụ tùng
    useEffect(() => {
        const fetchParts = async () => {
            try {
                const data = await getAllParts(); // Gọi API lấy danh sách phụ tùng
                setParts(data); // Lưu danh sách phụ tùng vào state
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

    // Xác định số lượng phụ tùng hiển thị
    const visibleAccessories = showAll ? categories : categories.slice(0, DEFAULT_ITEMS);

    return (
        <div className="relative bg-white/90 rounded-3xl shadow-xl p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold text-blue-700 drop-shadow-md flex items-center gap-2 m-0">
                    <Settings2 className="w-6 h-6 text-blue-500" />
                    Danh mục phụ tùng
                </h2>

                <button
                    onClick={() => navigate("/parts")}
                    className="px-6 py-2 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 text-white font-semibold shadow-lg hover:shadow-2xl hover:scale-105 transform transition-all duration-300 text-sm active:scale-95"
                    style={{
                        boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                        textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                    }}
                >
                    🔧 Xem tất cả
                </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-4">
                {visibleAccessories.map((item, idx) => (
                    <div
                        key={idx}
                        className="group flex flex-col items-center justify-center rounded-xl bg-white shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer p-3 border border-transparent hover:border-blue-300"
                        style={{
                            aspectRatio: "1/1",
                            overflow: "hidden",
                        }}
                        onClick={() => navigate(`/parts?name=${encodeURIComponent(item.name)}`)}
                        title={`Xem danh sách phụ tùng: ${item.name}`}
                    >
                        <div className="w-20 h-20 flex items-center justify-center">
                            <img
                                src={item.img}
                                alt={item.name}
                                className="w-full h-full object-contain rounded-xl group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        <span
                            className="text-base font-medium text-gray-800 text-center mt-2 px-1"
                            style={{
                                lineHeight: 1.3,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                width: "100%",
                            }}
                            title={item.name}
                        >
                            {item.name}
                        </span>
                    </div>
                ))}
            </div>

            {categories.length > DEFAULT_ITEMS && (
                <button
                    onClick={() => setShowAll((v) => !v)}
                    aria-label={showAll ? "Thu gọn" : "Xem thêm"}
                    className="absolute left-1/2 -translate-x-1/2 -bottom-5 w-10 h-10 flex items-center justify-center bg-white rounded-full border border-gray-300 shadow-lg hover:bg-blue-50 transition"
                >
                    {showAll ? (
                        <ChevronUp size={20} className="text-gray-700" />
                    ) : (
                        <ChevronDown size={20} className="text-gray-700" />
                    )}
                </button>
            )}
        </div>
    );
}