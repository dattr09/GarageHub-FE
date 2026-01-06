import React, { useState } from "react";
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
import { Sparkles } from "lucide-react";
import GeminiAsk from "../pages/Gemini/GeminiAsk";
import ChatWidget from "./ChatWidget";
import Statistics from "../pages/Statistics";
import BookAppointment from "../pages/Appointments/BookAppointment";
import AppointmentList from "../pages/Appointments/AppointmentList";
import SearchAppointment from "../pages/Appointments/SearchAppointment";
import AppointmentNotification from "./AppointmentNotification";

const HEADER_HEIGHT = 64;

const MainLayout = () => {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const userId = localStorage.getItem("userId");

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };
  const token = getCookie("jwt-token");
  const [showGemini, setShowGemini] = useState(false);

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
          <Route path="/brands" element={<BrandList />} />
          <Route path="/brands/add" element={<AddBrandForm />} />
          <Route path="/brands/edit/:id" element={<EditBrandForm />} />
          <Route path="/brands/:id" element={<BrandDetails />} />
          <Route path="/parts" element={<PartsList />} />
          <Route path="/parts/add" element={<AddPartForm />} />
          <Route path="/parts/edit/:id" element={<EditPartForm />} />
          <Route path="/parts/:id" element={<PartDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/ordersuccess" element={<OrderSuccess />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/motos" element={<MotoList />} />
          <Route path="/motos/add" element={<AddMotoForm />} />
          <Route path="/motos/edit/:licensePlate" element={<EditMotoForm />} />
          <Route path="/motos/:licensePlate" element={<MotoDetails />} />
          <Route path="/repair-orders" element={<RepairOrderList />} />
          <Route path="/repair-orders/add" element={<RepairOrderAdd />} />
          <Route path="/repair-orders/edit/:id" element={<RepairOrderEdit />} />
          <Route path="/repair-orders/:id" element={<RepairOrderDetails />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/appointments/book" element={<BookAppointment />} />
          <Route path="/appointments/search" element={<SearchAppointment />} />
          <Route path="/appointments" element={<AppointmentList />} />
          <Route path="/gemini/ask" element={<GeminiAsk />} />
          <Route
            path="/admin/chat"
            element={
              <ChatManagement
                adminId={userId || user?.userId}
                adminToken={token}
              />
            }
          />
        </Routes>
        <Outlet />
      </main>
      <Footer />
      <AppointmentNotification />
      {!showGemini && (
        <button
          className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-sky-400 via-blue-500 to-cyan-500 shadow-xl flex items-center justify-center z-[1000] hover:scale-110 transition-transform"
          style={{ boxShadow: "0 4px 20px rgba(14, 165, 233, 0.4)" }}
          onClick={() => setShowGemini(true)}
          aria-label="Open Gemini AI"
        >
          <Sparkles className="w-6 h-6 text-white" />
        </button>
      )}
      {showGemini && (
        <div className="z-[1100]">
          <GeminiAsk onClose={() => setShowGemini(false)} />
        </div>
      )}
      <ChatWidget userId={userId} userToken={token} />
    </div>
  );
};

export default MainLayout;
