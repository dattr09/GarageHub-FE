// Layout dành cho Admin (sidebar trái)
import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaSearch, FaUserCircle, FaChartBar, FaRegFileAlt, FaRegComments, FaRegChartBar, FaEnvelope, FaSignOutAlt } from "react-icons/fa";

const menu = [
  { name: "Dashboard", icon: <FaChartBar className="mr-3 text-2xl" />, path: "/admin/dashboard" },
  { name: "Users", icon: <FaUserCircle className="mr-3 text-2xl" />, path: "/admin/users" },
  { name: "Applications", icon: <FaRegFileAlt className="mr-3 text-xl" />, path: "/admin/applications" },
  { name: "Message", icon: <FaRegComments className="mr-3 text-xl" />, path: "/admin/message" },
  { name: "Statistics", icon: <FaRegChartBar className="mr-3 text-xl" />, path: "/admin/statistics" },
  { name: "News", icon: <FaEnvelope className="mr-3 text-xl" />, path: "/admin/news" },
];

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const profileRef = useRef();

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Xử lý đăng xuất ở đây (ví dụ: xóa token, chuyển trang...)
    alert("Logged out!");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-purple-600 text-white flex flex-col py-8 px-6 rounded-tr-3xl rounded-br-3xl">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src="/logo_garagehub.png"
            alt="Garage Hub Logo"
            className="w-14 h-14 rounded-full bg-white mr-3 object-contain"
          />
          <span className="text-2xl font-bold">Garage Hub</span>
        </div>
        {/* Menu */}
        <nav className="flex-1 mt-6">
          <ul className="space-y-2">
            {menu.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`relative flex items-center rounded-xl px-4 py-3 font-semibold transition ${
                    location.pathname === item.path
                      ? "bg-transparent text-white shadow-lg"
                      : "hover:bg-white/60 hover:bg-opacity-20 text-white"
                  }`}
                >
                  {location.pathname === item.path && (
                    <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-2 h-8 bg-white/50 rounded-xl shadow"></span>
                  )}
                  {item.icon}
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {/* Profile nhỏ */}
        <div className="mt-10 flex items-center relative" ref={profileRef}>
          <button
            className="flex items-center focus:outline-none"
            onClick={() => setShowMenu((prev) => !prev)}
          >
            <FaUserCircle className="text-3xl mr-3" />
            <div>
              <div className="font-semibold">Nguyễn Tú</div>
              <div className="text-xs text-blue-200">Admin</div>
            </div>
          </button>
          {showMenu && (
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 w-36 bg-white/50 rounded-xl shadow-lg z-10">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 text-purple-700 bg-purple-100/30 hover:bg-purple-200/50 rounded-xl transition"
              >
                <FaSignOutAlt className="mr-2" /> Logout
              </button>
            </div>
          )}
        </div>
      </aside>
      {/* Main content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
};

export default AdminLayout;