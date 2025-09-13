import React, { useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { FaSearch, FaUserCircle, FaCalendarAlt, FaEnvelope, FaChartBar, FaBriefcase, FaBell } from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Dữ liệu giả cho biểu đồ
const vacancyStatsData = [
    { week: "W1", application: 40, interview: 20, rejected: 5 },
    { week: "W2", application: 60, interview: 30, rejected: 10 },
    { week: "W3", application: 50, interview: 25, rejected: 8 },
    { week: "W4", application: 70, interview: 35, rejected: 12 },
    { week: "W5", application: 65, interview: 28, rejected: 9 },
    { week: "W6", application: 80, interview: 40, rejected: 15 },
];

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
                        <FaBell className="text-xl text-gray-500" />
                        <img
                            src="https://randomuser.me/api/portraits/men/32.jpg"
                            alt="avatar"
                            className="w-10 h-10 rounded-full object-cover"
                        />
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
                <div className="grid grid-cols-3 gap-6">
                    {/* Left: Profile & Recent Activities */}
                    <div className="col-span-1 flex flex-col gap-6">
                        <div className="bg-white rounded-2xl p-6 shadow flex flex-col items-center">
                            <img
                                src="https://randomuser.me/api/portraits/men/32.jpg"
                                alt="avatar"
                                className="w-20 h-20 rounded-full object-cover mb-2"
                            />
                            <div className="font-bold text-lg">Oda Dink</div>
                            <div className="text-gray-400 text-sm mb-4">Programmer</div>
                            {/* Progress */}
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex flex-col items-center">
                                    <div className="text-lg font-bold text-purple-600">66%</div>
                                    <div className="text-xs text-gray-400">Active</div>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="text-lg font-bold text-blue-500">31%</div>
                                    <div className="text-xs text-gray-400">Interview</div>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="text-lg font-bold text-green-400">7%</div>
                                    <div className="text-xs text-gray-400">Leave</div>
                                </div>
                            </div>
                            {/* Recent Activities */}
                            <div className="w-full">
                                <div className="font-semibold mb-2">Recent Activities</div>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li>Your application has progressed in a Vacancy</li>
                                    <li>Your application has been accepted</li>
                                    <li>Your application has been rejected</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    {/* Center: Chart */}
                    <div className="col-span-2 flex flex-col gap-6">
                        <div className="bg-white rounded-2xl p-6 shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className="font-semibold">Vacancy Stats</div>
                                {/* Toggle buttons */}
                                <div className="flex gap-4 text-xs">
                                    <button
                                        className={`flex items-center px-3 py-1 rounded-full font-semibold transition ${showLine.application
                                                ? "bg-blue-100 text-blue-700 ring-2 ring-blue-400"
                                                : "bg-gray-100 text-gray-400"
                                            }`}
                                        onClick={() => handleToggle("application")}
                                    >
                                        <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                                        Application Sent
                                    </button>
                                    <button
                                        className={`flex items-center px-3 py-1 rounded-full font-semibold transition ${showLine.interview
                                                ? "bg-green-100 text-green-700 ring-2 ring-green-400"
                                                : "bg-gray-100 text-gray-400"
                                            }`}
                                        onClick={() => handleToggle("interview")}
                                    >
                                        <span className="w-3 h-3 bg-green-400 rounded-full mr-2"></span>
                                        Interviews
                                    </button>
                                    <button
                                        className={`flex items-center px-3 py-1 rounded-full font-semibold transition ${showLine.rejected
                                                ? "bg-purple-100 text-purple-700 ring-2 ring-purple-400"
                                                : "bg-gray-100 text-gray-400"
                                            }`}
                                        onClick={() => handleToggle("rejected")}
                                    >
                                        <span className="w-3 h-3 bg-purple-600 rounded-full mr-2"></span>
                                        Rejected
                                    </button>
                                </div>
                            </div>
                            {/* Biểu đồ LineChart */}
                            <div className="h-40 w-full">
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
                        {/* Recommended Jobs */}
                        <div className="bg-white rounded-2xl p-6 shadow">
                            <div className="font-semibold mb-4">Recommended Jobs</div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-blue-50 rounded-xl p-4">
                                    <div className="font-bold">Database Programmer</div>
                                    <div className="text-xs text-gray-400 mb-2">Remote</div>
                                    <div className="text-sm font-semibold">$14,000 - $25,000</div>
                                </div>
                                <div className="bg-purple-50 rounded-xl p-4">
                                    <div className="font-bold">Senior Programmer</div>
                                    <div className="text-xs text-gray-400 mb-2">Part Time</div>
                                    <div className="text-sm font-semibold">$14,000 - $25,000</div>
                                </div>
                                <div className="bg-yellow-50 rounded-xl p-4">
                                    <div className="font-bold">Intern UX Designer</div>
                                    <div className="text-xs text-gray-400 mb-2">Full Time</div>
                                    <div className="text-sm font-semibold">$14,000 - $25,000</div>
                                </div>
                            </div>
                        </div>
                        {/* Featured Companies */}
                        <div className="bg-white rounded-2xl p-6 shadow">
                            <div className="font-semibold mb-4">Featured Companies</div>
                            <div className="grid grid-cols-4 gap-4">
                                <div className="bg-blue-100 rounded-xl p-3 text-center font-semibold">Herman-Carter</div>
                                <div className="bg-green-100 rounded-xl p-3 text-center font-semibold">Funk Inc.</div>
                                <div className="bg-yellow-100 rounded-xl p-3 text-center font-semibold">Williamson Inc.</div>
                                <div className="bg-purple-100 rounded-xl p-3 text-center font-semibold">Donnelly Ltd.</div>
                            </div>
                        </div>
                    </div>
                </div>
        </AdminLayout>
    );
};

export default Dashboard;