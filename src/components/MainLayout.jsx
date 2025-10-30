import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import HomePage from "../pages/HomePage";
import Header from "./Header";
import Footer from "./Footer";
import BrandList from "../pages/Brands/BrandList";
import AddBrandForm from "../pages/Brands/AddBrandForm";
import EditBrandForm from "../pages/Brands/EditBrandForm";
import BrandDetails from "../pages/Brands/BrandDetails";
import PartsList from "../pages/Parts/PartsList";
import AddPartForm from "../pages/Parts/AddPartForm";
import EditPartForm from "../pages/Parts/EditPartForm";
import PartDetails from "../pages/Parts/PartDetails";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import OrderSuccess from "../pages/OrderSuccess";
import OrderHistory from "../pages/OrderHistory";
import MotoList from "../pages/Motos/MotoList";
import AddMotoForm from "../pages/Motos/AddMotoForm";
import EditMotoForm from "../pages/Motos/EditMotoForm";
import MotoDetails from "../pages/Motos/MotoDetails";
import RepairOrderList from "../pages/RepairOrders/RepairOrderList";
import RepairOrderAdd from "../pages/RepairOrders/RepairOrderAdd";
import RepairOrderEdit from "../pages/RepairOrders/RepairOrderEdit";
import RepairOrderDetails from "../pages/RepairOrders/RepairOrderDetails";
import ChatManagement from "../pages/Admin/ChatManagement";

const HEADER_HEIGHT = 64;

// Layout chính cho toàn bộ trang, chứa Header, Footer và định tuyến các trang con
const MainLayout = () => {
    // Lấy thông tin user từ localStorage
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const userId = localStorage.getItem('userId');
    
    // Lấy token từ cookie
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    };
    const token = getCookie('jwt-token');

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
                    {/* Route chính */}
                    <Route path="/" element={<HomePage />} />

                    {/* Các route cho Brands */}
                    <Route path="/brands" element={<BrandList />} />
                    <Route path="/brands/add" element={<AddBrandForm />} />
                    <Route path="/brands/edit/:id" element={<EditBrandForm />} />
                    <Route path="/brands/:id" element={<BrandDetails />} />

                    {/* Các route cho Parts */}
                    <Route path="/parts" element={<PartsList />} />
                    <Route path="/parts/add" element={<AddPartForm />} />
                    <Route path="/parts/edit/:id" element={<EditPartForm />} />
                    <Route path="/parts/:id" element={<PartDetails />} />

                    {/* Các route giỏ hàng và thanh toán */}
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/ordersuccess" element={<OrderSuccess />} />
                    <Route path="/order-history" element={<OrderHistory />} />

                    {/* Các route cho Motos */}
                    <Route path="/motos" element={<MotoList />} />
                    <Route path="/motos/add" element={<AddMotoForm />} />
                    <Route path="/motos/edit/:licensePlate" element={<EditMotoForm />} />
                    <Route path="/motos/:id" element={<MotoDetails />} />

                    {/* Các route cho RepairOrders */}
                    <Route path="/repair-orders" element={<RepairOrderList />} />
                    <Route path="/repair-orders/add" element={<RepairOrderAdd />} />
                    <Route path="/repair-orders/edit/:id" element={<RepairOrderEdit />} />
                    <Route path="/repair-orders/:id" element={<RepairOrderDetails />} />

                    {/* Route cho Admin Chat Management */}
                    <Route 
                        path="/admin/chat" 
                        element={<ChatManagement adminId={userId || user?.userId} adminToken={token} />} 
                    />
                </Routes>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;