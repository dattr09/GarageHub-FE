import React, { useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { FaSearch, FaUserCircle, FaCalendarAlt, FaEnvelope, FaChartBar, FaBriefcase, FaBell } from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { PieChart, Pie, Cell } from "recharts";

// Dữ liệu giả cho biểu đồ
const vacancyStatsData = [
    { week: "W1", application: 40, interview: 20, rejected: 5 },
    { week: "W2", application: 60, interview: 30, rejected: 10 },
    { week: "W3", application: 50, interview: 25, rejected: 8 },
    { week: "W4", application: 70, interview: 35, rejected: 12 },
    { week: "W5", application: 65, interview: 28, rejected: 9 },
    { week: "W6", application: 80, interview: 40, rejected: 15 },
];

// Dữ liệu cho PieChart
const pieData = [
    { key: "application", name: "Application Sent", value: 75 },
    { key: "interview", name: "Interviews", value: 86 },
    { key: "rejected", name: "Rejected", value: 15 },
];
const pieColors = ["#3b82f6", "#22c55e", "#a21caf"];

const Dashboard = () => {
    // State để bật/tắt từng line
    const [showLine, setShowLine] = useState({
        application: true,
        interview: true,
        rejected: true,
    });

    const handleToggle = (key) => {
        setShowLine((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    // Lọc pieData theo showLine
    const filteredPieData = pieData.filter(item => showLine[item.key]);
    const filteredPieColors = pieColors.filter((_, idx) => filteredPieData.find(d => d.key === pieData[idx].key));

    return (
        <AdminLayout>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search something here..."
                            className="pl-10 pr-4 py-2 rounded-full bg-gray-100 border focus:outline-none"
                        />
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                    <FaBell className="w-6 h-6 text-xl text-gray-500" />
                    <FaUserCircle className="w-6 h-6 text-xl text-gray-500" />
                </div>
            </div>
            {/* Top cards */}
            <div className="grid grid-cols-4 gap-6 mb-8">
                <div className="bg-purple-600 text-white rounded-2xl p-6 flex flex-col items-center shadow">
                    <FaCalendarAlt className="text-3xl mb-2" />
                    <div className="text-lg font-semibold">Interviews Schedule</div>
                    <div className="text-3xl font-bold mt-2">86</div>
                </div>
                <div className="bg-blue-500 text-white rounded-2xl p-6 flex flex-col items-center shadow">
                    <FaBriefcase className="text-3xl mb-2" />
                    <div className="text-lg font-semibold">Application Sent</div>
                    <div className="text-3xl font-bold mt-2">75</div>
                </div>
                <div className="bg-green-400 text-white rounded-2xl p-6 flex flex-col items-center shadow">
                    <FaUserCircle className="text-3xl mb-2" />
                    <div className="text-lg font-semibold">Profile Viewed</div>
                    <div className="text-3xl font-bold mt-2">45,673</div>
                </div>
                <div className="bg-lime-400 text-white rounded-2xl p-6 flex flex-col items-center shadow">
                    <FaEnvelope className="text-3xl mb-2" />
                    <div className="text-lg font-semibold">Unread Message</div>
                    <div className="text-3xl font-bold mt-2">93</div>
                </div>
            </div>
            {/* Main grid */}
            <div className="grid grid-cols-3 gap-6 h-72">
                {/* PieChart bên trái */}
                <div className="bg-white rounded-2xl p-6 shadow flex flex-col items-center justify-center h-full">
                    <div className="font-semibold mb-2">Application Status</div>
                    <PieChart width={180} height={180}>
                        <Pie
                            data={filteredPieData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={70}
                            label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                                const RADIAN = Math.PI / 180;
                                // Tính vị trí label nằm trong từng phần
                                const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
                                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                const y = cy + radius * Math.sin(-midAngle * RADIAN);
                                return (
                                    <text
                                        x={x}
                                        y={y}
                                        fill="#222"
                                        textAnchor="middle"
                                        dominantBaseline="central"
                                        fontWeight={700}
                                        fontSize={16}
                                        style={{
                                            pointerEvents: "none",
                                            textShadow: "0 1px 4px #fff, 0 0 8px #fff"
                                        }}
                                    >
                                        {filteredPieData[index]?.value}
                                    </text>
                                );
                            }}
                            labelLine={false}
                        >
                            {filteredPieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={pieColors[pieData.findIndex(d => d.key === entry.key)]} />
                            ))}
                        </Pie>
                    </PieChart>
                    <div className="flex flex-row gap-4 mt-2 text-xs">
                        {filteredPieData.map((entry, idx) => (
                            <div key={entry.name} className="flex items-center gap-2">
                                <span
                                    className="inline-block w-3 h-3 rounded-full"
                                    style={{ background: pieColors[pieData.findIndex(d => d.key === entry.key)] }}
                                ></span>
                                {entry.name}
                            </div>
                        ))}
                    </div>
                </div>
                {/* Center: Chart và các phần khác */}
                <div className="col-span-2 flex flex-col gap-6 h-full">
                    <div className="bg-white rounded-2xl p-6 shadow h-full flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <div className="font-semibold">Vacancy Stats</div>
                            {/* Toggle buttons */}
                            <div className="flex gap-4 text-xs">
                                {/* Application Sent */}
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={showLine.application}
                                        onChange={() => handleToggle("application")}
                                        id="toggle-application"
                                        className="peer hidden"
                                    />
                                    <label
                                        htmlFor="toggle-application"
                                        className={`w-8 h-4 flex items-center rounded-full cursor-pointer transition-colors
                ${showLine.application ? "bg-blue-500" : "bg-gray-300"}`}
                                    >
                                        <span
                                            className={`block w-4 h-4 bg-white rounded-full shadow transform transition-transform
                    ${showLine.application ? "translate-x-4" : ""}`}
                                        ></span>
                                    </label>
                                    <span className="ml-2">Application Sent</span>
                                </div>
                                {/* Interviews */}
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={showLine.interview}
                                        onChange={() => handleToggle("interview")}
                                        id="toggle-interview"
                                        className="peer hidden"
                                    />
                                    <label
                                        htmlFor="toggle-interview"
                                        className={`w-8 h-4 flex items-center rounded-full cursor-pointer transition-colors
                ${showLine.interview ? "bg-green-500" : "bg-gray-300"}`}
                                    >
                                        <span
                                            className={`block w-4 h-4 bg-white rounded-full shadow transform transition-transform
                    ${showLine.interview ? "translate-x-4" : ""}`}
                                        ></span>
                                    </label>
                                    <span className="ml-2">Interviews</span>
                                </div>
                                {/* Rejected */}
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={showLine.rejected}
                                        onChange={() => handleToggle("rejected")}
                                        id="toggle-rejected"
                                        className="peer hidden"
                                    />
                                    <label
                                        htmlFor="toggle-rejected"
                                        className={`w-8 h-4 flex items-center rounded-full cursor-pointer transition-colors
                ${showLine.rejected ? "bg-purple-600" : "bg-gray-300"}`}
                                    >
                                        <span
                                            className={`block w-4 h-4 bg-white rounded-full shadow transform transition-transform
                    ${showLine.rejected ? "translate-x-4" : ""}`}
                                        ></span>
                                    </label>
                                    <span className="ml-2">Rejected</span>
                                </div>
                            </div>
                        </div>
                        {/* Biểu đồ LineChart */}
                        <div className="flex-1 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={vacancyStatsData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="week" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    {showLine.application && (
                                        <Line type="monotone" dataKey="application" stroke="#3b82f6" name="Application Sent" strokeWidth={2} />
                                    )}
                                    {showLine.interview && (
                                        <Line type="monotone" dataKey="interview" stroke="#22c55e" name="Interviews" strokeWidth={2} />
                                    )}
                                    {showLine.rejected && (
                                        <Line type="monotone" dataKey="rejected" stroke="#a21caf" name="Rejected" strokeWidth={2} />
                                    )}
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;