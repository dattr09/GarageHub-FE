import React, { useState, useEffect } from "react";
import { BarChart2, ShoppingCart, Wrench } from "lucide-react";
import { getStatistics } from "../services/StatisticsApi";
import {
    PieChart, Pie, Cell, Tooltip as ReTooltip,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer
} from "recharts";

const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth() + 1;

const COLORS = ["#3498db", "#27ae60"];

export default function Statistics() {
    const [type, setType] = useState("month");
    const [month, setMonth] = useState(currentMonth);
    const [year, setYear] = useState(currentYear);
    const [quarter, setQuarter] = useState(1);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        // Đảm bảo month luôn là 2 chữ số khi truyền lên backend
        const params = {
            type,
            month: month < 10 ? `0${month}` : `${month}`,
            year,
            quarter
        };
        getStatistics(params).then(setStats);
    }, [type, month, year, quarter]);

    // Chuẩn bị dữ liệu cho biểu đồ
    const chartData = [
        {
            name: "Đơn hàng đã bán",
            value: stats?.orders ?? 0,
            income: stats?.ordersIncome ?? 0,
        },
        {
            name: "Sửa chữa hoàn thành",
            value: stats?.repairs ?? 0,
            income: stats?.repairsIncome ?? 0,
        },
    ];

    const totalIncome = (stats?.ordersIncome ?? 0) + (stats?.repairsIncome ?? 0);

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow mt-8">
            {/* Tiêu đề căn giữa */}
            <div className="flex items-center justify-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2 text-blue-700">
                    <BarChart2 className="w-6 h-6" /> Thống kê doanh thu & đơn hàng
                </h2>
            </div>
            {/* Bộ lọc sát phải */}
            <div className="flex justify-end mb-6">
                <div className="flex flex-wrap gap-4">
                    <select value={type} onChange={e => setType(e.target.value)} className="border rounded px-3 py-2">
                        <option value="month">Theo tháng</option>
                        <option value="quarter">Theo quý</option>
                        <option value="year">Theo năm</option>
                    </select>
                    {type === "month" && (
                        <>
                            <select value={month} onChange={e => setMonth(Number(e.target.value))} className="border rounded px-3 py-2">
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>
                                ))}
                            </select>
                            <select value={year} onChange={e => setYear(Number(e.target.value))} className="border rounded px-3 py-2">
                                {Array.from({ length: 5 }, (_, i) => (
                                    <option key={currentYear - i} value={currentYear - i}>{currentYear - i}</option>
                                ))}
                            </select>
                        </>
                    )}
                    {type === "quarter" && (
                        <>
                            <select value={quarter} onChange={e => setQuarter(Number(e.target.value))} className="border rounded px-3 py-2">
                                {[1, 2, 3, 4].map(q => (
                                    <option key={q} value={q}>Quý {q}</option>
                                ))}
                            </select>
                            <select value={year} onChange={e => setYear(Number(e.target.value))} className="border rounded px-3 py-2">
                                {Array.from({ length: 5 }, (_, i) => (
                                    <option key={currentYear - i} value={currentYear - i}>{currentYear - i}</option>
                                ))}
                            </select>
                        </>
                    )}
                    {type === "year" && (
                        <select value={year} onChange={e => setYear(Number(e.target.value))} className="border rounded px-3 py-2">
                            {Array.from({ length: 5 }, (_, i) => (
                                <option key={currentYear - i} value={currentYear - i}>{currentYear - i}</option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            {/* Tổng thu nhập */}
            <div className="mb-8 text-center">
                <span className="text-lg font-semibold text-gray-700 mr-2">Tổng thu nhập:</span>
                <span className="text-2xl font-bold text-green-600">
                    {totalIncome.toLocaleString("vi-VN")} VND
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Biểu đồ tròn */}
                <div className="flex flex-col items-center">
                    <h4 className="font-semibold mb-2 text-blue-700">Tỉ lệ số lượng</h4>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={chartData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label
                            >
                                {chartData.map((entry, idx) => (
                                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                                ))}
                            </Pie>
                            <ReTooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                {/* Biểu đồ cột với 2 màu và thon lại */}
                <div className="flex flex-col items-center">
                    <h4 className="font-semibold mb-2 text-blue-700">Doanh thu từng loại</h4>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={chartData} barCategoryGap="60%">
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <ReTooltip />
                            <Legend />
                            <Bar dataKey="income" name="Doanh thu (VND)">
                                <Cell fill="#3498db" /> {/* Màu cho cột đầu */}
                                <Cell fill="#27ae60" /> {/* Màu cho cột thứ hai */}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Thông tin tổng quan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-6 flex flex-col items-center shadow">
                    <ShoppingCart className="w-8 h-8 text-blue-500 mb-2" />
                    <div className="text-3xl font-bold text-blue-700">{stats?.orders ?? "--"}</div>
                    <div className="text-gray-600 mt-1">Đơn hàng đã bán</div>
                    <div className="text-green-700 font-semibold mt-2">
                        {stats?.ordersIncome ? stats.ordersIncome.toLocaleString("vi-VN") + " VND" : "--"}
                    </div>
                </div>
                <div className="bg-green-50 rounded-lg p-6 flex flex-col items-center shadow">
                    <Wrench className="w-8 h-8 text-green-500 mb-2" />
                    <div className="text-3xl font-bold text-green-700">{stats?.repairs ?? "--"}</div>
                    <div className="text-gray-600 mt-1">Đơn sửa chữa hoàn thành</div>
                    <div className="text-green-700 font-semibold mt-2">
                        {stats?.repairsIncome ? stats.repairsIncome.toLocaleString("vi-VN") + " VND" : "--"}
                    </div>
                </div>
            </div>
        </div>
    );
}