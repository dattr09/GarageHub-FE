// VÍ DỤ: Cách thêm ChatManagement vào Admin Routes

import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Admin/Dashboard";
import UserManager from "../pages/Admin/UserManager";
import ChatManagement from "../pages/Admin/ChatManagement"; // Import ChatManagement

const AdminRoutes = () => {
    // Lấy thông tin admin từ localStorage hoặc context
    const admin = JSON.parse(localStorage.getItem('user'));
    const adminToken = localStorage.getItem('jwt-token');

    return (
        <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<UserManager />} />
            
            {/* Thêm route cho Chat Management */}
            <Route 
                path="/chat" 
                element={
                    <ChatManagement 
                        adminId={admin?._id} 
                        adminToken={adminToken} 
                    />
                } 
            />
        </Routes>
    );
};

export default AdminRoutes;
