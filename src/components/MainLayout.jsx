import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import HomePage from "../pages/HomePage";
import Header from "./Header";
import Footer from "./Footer";
import BrandList from "../pages/Brands/BrandList";
import PartsList from "../pages/Parts/PartsList";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import OrderSuccess from "../pages/OrderSuccess";

const HEADER_HEIGHT = 64;

// Layout chính cho toàn bộ trang, chứa Header, Footer và định tuyến các trang con
const MainLayout = () => {
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
                    <Route path="/" element={<HomePage />} />
                    <Route path="brands" element={<BrandList />} />
                    <Route path="parts" element={<PartsList />} />
                    <Route path="cart" element={<Cart />} />
                    <Route path="checkout" element={<Checkout />} />
                    {/* Thêm các Route khác tại đây */}
                    <Route path="order-success" element={<OrderSuccess />} />
                </Routes>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;