import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import AuthContainer from "./pages/AuthContainer";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import VerifyPasswordPage from "./pages/VerifyPasswordPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import MainLayout from "./components/MainLayout";
import HomePage from "./pages/HomePage"; // Import HomePage từ đúng vị trí

// Import Brand Pages
import BrandList from "./pages/Brands/BrandList";
import AddBrandForm from "./pages/Brands/AddBrandForm";
import EditBrandForm from "./pages/Brands/EditBrandForm";
import BrandDetails from "./pages/Brands/BrandDetails";

// Import Part Pages
import PartsList from "./pages/Parts/PartsList";
import AddPartForm from "./pages/Parts/AddPartForm";
import EditPartForm from "./pages/Parts/EditPartForm";
import PartDetails from "./pages/Parts/PartDetails";

// Import Cart and Checkout Pages
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import OrderHistory from "./pages/OrderHistory";

// Import Moto Pages
import MotoList from "./pages/Motos/MotoList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Các route công khai */}
        <Route path="/login" element={<AuthContainer />} />
        <Route path="/register" element={<AuthContainer />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-password" element={<VerifyPasswordPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />

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

        {/* Route sử dụng MainLayout */}
        <Route path="/*" element={<MainLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;