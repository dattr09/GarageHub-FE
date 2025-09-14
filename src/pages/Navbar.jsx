import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaInfoCircle, FaCogs, FaClipboardList, FaShoppingCart, FaHeart, FaUserCircle, FaSearch, FaTools } from "react-icons/fa";

const menu = [
    { name: "Trang chủ", icon: <FaHome />, path: "/" },
    { name: "Giới thiệu", icon: <FaInfoCircle />, path: "/about" },
    { name: "Linh kiện", icon: <FaCogs />, path: "/parts" },
    { name: "Đặt đơn sửa", icon: <FaClipboardList />, path: "/order" },
    { name: "Giỏ hàng", icon: <FaShoppingCart />, path: "/cart" },
    { name: "Yêu thích", icon: <FaHeart />, path: "/favorites" },
    { name: "Profile", icon: <FaUserCircle />, path: "/profile" },
];

const Navbar = () => {
    const location = useLocation();

    // Tách menu thành 3 nhóm
    const centerMenu = menu.slice(0, 4); // Trang chủ, Giới thiệu, Linh kiện, Đặt đơn sửa
    const rightMenu = menu.slice(4); // Giỏ hàng, Yêu thích, Profile

    return (
        <nav className="w-full bg-white shadow flex items-center px-8 h-16 fixed top-0 left-0 z-30">
            {/* Logo + Search bên trái */}
            <div className="flex items-center gap-4 flex-shrink-0 w-auto">
                {/* Logo thay cho tên */}
                <img
                    src="/logo_garagehub.png"
                    alt="GarageHub Logo"
                    className="h-14 w-14 object-contain"
                />
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        className="pl-9 pr-3 py-2 rounded-full bg-gray-100 border focus:outline-none w-64"
                    />
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
            </div>
            {/* Menu giữa */}
            <div className="flex-1 flex items-center justify-center gap-2">
                {centerMenu.map((item) => (
                    <Link
                        key={item.name}
                        to={item.path}
                        className={`flex items-center gap-2 px-4 py-2 rounded transition
                    ${location.pathname === item.path
                                ? "bg-purple-100 text-purple-700 font-semibold"
                                : "text-gray-700 hover:bg-gray-100"}`}
                    >
                        {item.icon}
                        <span className="hidden md:inline">{item.name}</span>
                    </Link>
                ))}
            </div>
            {/* Menu phải: chỉ icon */}
            <div className="flex items-center gap-3 flex-shrink-0">
                {rightMenu.map((item) => (
                    <Link
                        key={item.name}
                        to={item.path}
                        className={`p-2 rounded-full transition text-xl
                    ${location.pathname === item.path
                                ? "bg-purple-100 text-purple-700"
                                : "text-gray-700 hover:bg-gray-100"}`}
                        title={item.name}
                    >
                        {item.icon}
                    </Link>
                ))}
            </div>
        </nav>
    );
};

export default Navbar;