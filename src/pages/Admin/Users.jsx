import React from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { FaSearch, FaUserPlus, FaUserEdit, FaTrash } from "react-icons/fa";

// Dữ liệu giả cho user
const fakeUsers = [
    {
        id: 1,
        name: "Oda Dink",
        email: "oda.dink@example.com",
        role: "Admin",
        status: "Active",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
        id: 2,
        name: "Anna Smith",
        email: "anna.smith@example.com",
        role: "Staff",
        status: "Active",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
        id: 3,
        name: "John Doe",
        email: "john.doe@example.com",
        role: "Staff",
        status: "Inactive",
        avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    },
    {
        id: 4,
        name: "Jane Lee",
        email: "jane.lee@example.com",
        role: "Manager",
        status: "Active",
        avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    },
];

const badgeColors = {
    Admin: "bg-blue-100 text-blue-700",
    Staff: "bg-green-100 text-green-700",
    Manager: "bg-yellow-100 text-yellow-700",
};

const statusColors = {
    Active: "bg-green-100 text-green-700",
    Inactive: "bg-gray-200 text-gray-500",
};

const Users = () => {
    return (
        <AdminLayout>
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold">Users Management</h1>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search user..."
                                className="pl-10 pr-4 py-2 rounded-full bg-gray-100 border focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                            />
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                        <button className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full shadow-lg hover:from-blue-600 hover:to-blue-800 transition font-semibold">
                            <FaUserPlus /> Add User
                        </button>
                    </div>
                </div>
                {/* User Table */}
                <div className="bg-white rounded-2xl shadow p-6 overflow-x-auto">
                    <table className="w-full min-w-[700px] text-center">
                        <thead>
                            <tr className="text-gray-500 border-b">
                                <th className="py-4 font-medium">#</th>
                                <th className="py-4 font-medium">Avatar</th>
                                <th className="py-4 font-medium">Name</th>
                                <th className="py-4 font-medium">Email</th>
                                <th className="py-4 font-medium">Role</th>
                                <th className="py-4 font-medium">Status</th>
                                <th className="py-4 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fakeUsers.map((user, idx) => (
                                <tr
                                    key={user.id}
                                    className="border-b last:border-b-0 hover:bg-blue-50/60 transition group"
                                >
                                    <td className="py-4 font-semibold text-gray-400">{idx + 1}</td>
                                    <td className="py-4">
                                        <div className="flex items-center justify-center">
                                            <img
                                                src={user.avatar}
                                                alt={user.name}
                                                className="w-14 h-14 rounded-full object-cover border-2 border-blue-200 shadow-sm group-hover:scale-105 transition"
                                            />
                                        </div>
                                    </td>
                                    <td className="py-4 font-semibold text-gray-800">{user.name}</td>
                                    <td className="py-4 text-gray-600">{user.email}</td>
                                    <td className="py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeColors[user.role] || "bg-gray-100 text-gray-700"}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[user.status]}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="py-4 text-center align-middle">
                                        <div className="inline-flex items-center justify-center gap-2">
                                            <button
                                                className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-800 transition shadow"
                                                title="Edit"
                                            >
                                                <FaUserEdit />
                                            </button>
                                            <button
                                                className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-800 transition shadow"
                                                title="Delete"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
        </AdminLayout>
    );
};

export default Users;