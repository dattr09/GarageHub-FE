import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";
import AuthContainer from "./pages/AuthContainer";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import VerifyPasswordPage from "./pages/VerifyPasswordPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import ConfirmOrder from "./pages/ConfirmOrder";
import MainLayout from "./components/MainLayout";


function App() {
  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#363636',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          {/* Các route công khai */}
          <Route path="/login" element={<AuthContainer />} />
          <Route path="/register" element={<AuthContainer />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-password" element={<VerifyPasswordPage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />
          <Route path="/confirm-order/:orderId" element={<ConfirmOrder />} />
          {/* Route sử dụng MainLayout */}
          <Route path="/*" element={<MainLayout />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;