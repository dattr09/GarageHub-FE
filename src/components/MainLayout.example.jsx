// VÍ DỤ: Cách tích hợp ChatWidget vào MainLayout.jsx

import React, { useState, useEffect } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import HomePage from "../pages/HomePage";
import Header from "./Header";
import Footer from "./Footer";
import ChatWidget from "./ChatWidget"; // Import ChatWidget
// ... các import khác

const HEADER_HEIGHT = 64;

const MainLayout = () => {
    // State để lưu thông tin user đã đăng nhập
    const [currentUser, setCurrentUser] = useState(null);
    const [userToken, setUserToken] = useState(null);

    // Lấy thông tin user từ localStorage hoặc context khi component mount
    useEffect(() => {
        // Ví dụ: Lấy từ localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('jwt-token'); // hoặc document.cookie
        
        if (user) {
            setCurrentUser(user);
            setUserToken(token);
        }
    }, []);

    return (
        <div className="main-layout bg-gradient-to-tr from-blue-200 via-white to-blue-100 flex flex-col min-h-screen">
            <div
                className="fixed top-0 left-0 w-full z-50 bg-white/80 shadow"
                style={{ height: HEADER_HEIGHT }}
            >
                <Header />
            </div>
            <main className="flex-1 p-4" style={{ paddingTop: HEADER_HEIGHT }}>
                <Routes>
                    {/* ... các routes */}
                </Routes>
                <Outlet />
            </main>
            <Footer />
            
            {/* Thêm ChatWidget - chỉ hiển thị khi user đã đăng nhập */}
            {currentUser && currentUser._id && (
                <ChatWidget 
                    userId={currentUser._id} 
                    userToken={userToken} 
                />
            )}
        </div>
    );
};

export default MainLayout;
