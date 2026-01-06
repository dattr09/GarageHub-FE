import React, { useState, useEffect } from "react";
import { BarChart2, ShoppingCart, Wrench, TrendingUp, DollarSign, Calendar } from "lucide-react";
import { getStatistics } from "../services/StatisticsApi";
import {
    PieChart, Pie, Cell, Tooltip as ReTooltip,
    LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer
} from "recharts";

const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth() + 1;

const COLORS = {
    orders: "#3b82f6",
    ordersIncome: "#06b6d4",
    repairs: "#10b981",
    repairsIncome: "#f59e0b",
};

export default function Statistics() {
    const [type, setType] = useState("year");
    const [month, setMonth] = useState(currentMonth);
    const [year, setYear] = useState(currentYear);
    const [quarter, setQuarter] = useState(Math.ceil(currentMonth / 3));
    const [stats, setStats] = useState(null);
    const [monthlyData, setMonthlyData] = useState([]);

    const [visibleLines, setVisibleLines] = useState({
        ordersIncome: true,
        repairsIncome: true,
        orders: false,
        repairs: false,
    });

    useEffect(() => {
        const params = {
            type,
            month: month < 10 ? `0${month}` : `${month}`,
            year,
            quarter
        };
        getStatistics(params).then(setStats);
    }, [type, month, year, quarter]);

    useEffect(() => {
        if (type === "year") {
            const fetchMonthlyData = async () => {
                const promises = Array.from({ length: 12 }, (_, i) => {
                    const m = i + 1;
                    return getStatistics({
                        type: "month",
                        month: m < 10 ? `0${m}` : `${m}`,
                        year
                    });
                });
                const results = await Promise.all(promises);
                const data = results.map((res, i) => ({
                    name: `T${i + 1}`,
                    ordersIncome: res?.ordersIncome || 0,
                    repairsIncome: res?.repairsIncome || 0,
                    orders: res?.orders || 0,
                    repairs: res?.repairs || 0,
                }));
                setMonthlyData(data);
            };
            fetchMonthlyData();
        }
    }, [type, year]);

    const toggleLine = (key) => {
        setVisibleLines(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const pieData = [
        { name: "Đơn hàng", value: stats?.orders ?? 0 },
        { name: "Sửa chữa", value: stats?.repairs ?? 0 },
    ];

    const totalIncome = (stats?.ordersIncome ?? 0) + (stats?.repairsIncome ?? 0);
    const formatCurrency = (val) => new Intl.NumberFormat("vi-VN").format(val);

    const lineConfigs = [
        { key: "ordersIncome", label: "Doanh thu đơn hàng", color: COLORS.ordersIncome },
        { key: "repairsIncome", label: "Doanh thu sửa chữa", color: COLORS.repairsIncome },
        { key: "orders", label: "Số đơn hàng", color: COLORS.orders },
        { key: "repairs", label: "Số sửa chữa", color: COLORS.repairs },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-sky-50">
            <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 text-white">
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm mb-3">
                            <BarChart2 className="w-7 h-7" />
                        </div>
                        <h1 className="text-3xl font-bold mb-1">Thống Kê Doanh Thu</h1>
                        <p className="text-white/80 text-sm">Phân tích đơn hàng và sửa chữa</p>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 -mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white shadow-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <DollarSign className="w-8 h-8 opacity-80" />
                            <span className="text-white/80">Tổng doanh thu</span>
                        </div>
                        <div className="text-3xl font-bold">{formatCurrency(totalIncome)} ₫</div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                <ShoppingCart className="w-5 h-5 text-blue-600" />
                            </div>
                            <span className="text-gray-500">Đơn hàng</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-800">{stats?.orders ?? 0}</div>
                        <div className="text-sm text-cyan-600 font-medium mt-1">{formatCurrency(stats?.ordersIncome ?? 0)} ₫</div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                                <Wrench className="w-5 h-5 text-emerald-600" />
                            </div>
                            <span className="text-gray-500">Sửa chữa</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-800">{stats?.repairs ?? 0}</div>
                        <div className="text-sm text-amber-600 font-medium mt-1">{formatCurrency(stats?.repairsIncome ?? 0)} ₫</div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 mt-6">
                <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
                    <div className="flex flex-wrap gap-3 items-center">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <select
                            value={type}
                            onChange={e => setType(e.target.value)}
                            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="month">Theo tháng</option>
                            <option value="quarter">Theo quý</option>
                            <option value="year">Theo năm</option>
                        </select>
                        {type === "month" && (
                            <select
                                value={month}
                                onChange={e => setMonth(Number(e.target.value))}
                                className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>
                                ))}
                            </select>
                        )}
                        {type === "quarter" && (
                            <select
                                value={quarter}
                                onChange={e => setQuarter(Number(e.target.value))}
                                className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {[1, 2, 3, 4].map(q => (
                                    <option key={q} value={q}>Quý {q}</option>
                                ))}
                            </select>
                        )}
                        <select
                            value={year}
                            onChange={e => setYear(Number(e.target.value))}
                            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {Array.from({ length: 5 }, (_, i) => (
                                <option key={currentYear - i} value={currentYear - i}>{currentYear - i}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-blue-500" />
                                Biểu đồ xu hướng
                            </h3>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {lineConfigs.map(config => (
                                <button
                                    key={config.key}
                                    onClick={() => toggleLine(config.key)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${visibleLines[config.key]
                                        ? "text-white shadow"
                                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                        }`}
                                    style={visibleLines[config.key] ? { backgroundColor: config.color } : {}}
                                >
                                    <span className={`w-2 h-2 rounded-full ${visibleLines[config.key] ? "bg-white" : ""}`}
                                        style={!visibleLines[config.key] ? { backgroundColor: config.color } : {}} />
                                    {config.label}
                                </button>
                            ))}
                        </div>

                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="name" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <ReTooltip
                                    contentStyle={{
                                        backgroundColor: "white",
                                        border: "none",
                                        borderRadius: "12px",
                                        boxShadow: "0 10px 40px rgba(0,0,0,0.1)"
                                    }}
                                    formatter={(value, name) => {
                                        const label = lineConfigs.find(c => c.key === name)?.label || name;
                                        return [formatCurrency(value), label];
                                    }}
                                />
                                <Legend />
                                {lineConfigs.map(config => (
                                    visibleLines[config.key] && (
                                        <Line
                                            key={config.key}
                                            type="monotone"
                                            dataKey={config.key}
                                            name={config.label}
                                            stroke={config.color}
                                            strokeWidth={3}
                                            dot={{ fill: config.color, strokeWidth: 2, r: 4 }}
                                            activeDot={{ r: 6, strokeWidth: 0 }}
                                        />
                                    )
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Tỉ lệ số lượng</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    innerRadius={50}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    labelLine={false}
                                >
                                    <Cell fill={COLORS.orders} />
                                    <Cell fill={COLORS.repairs} />
                                </Pie>
                                <ReTooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex justify-center gap-6 mt-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.orders }}></div>
                                <span className="text-sm text-gray-600">Đơn hàng</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.repairs }}></div>
                                <span className="text-sm text-gray-600">Sửa chữa</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}