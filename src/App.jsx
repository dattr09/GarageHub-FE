import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import LoginAdmin from "./pages/Admin/LoginAdmin";
import Dashboard from "./pages/Admin/Dashboard";
import Users from "./pages/Admin/UserManager";
import UserLayout from "./layouts/UserLayout";
import AuthenContainer from "./pages/AuthenContainer";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Các route công khai */}
        <Route path="/admin" element={<LoginAdmin />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/login" element={<AuthenContainer />} />
        <Route path="/register" element={<AuthenContainer />} /> 
        {/* Các route dành cho user */}
        <Route
          path="/*"
          element={
            <UserLayout>
              <Routes>
                <Route path="/" element={<h1>Trang chủ</h1>} />
                <Route path="/profile" element={<h1>Trang cá nhân</h1>} />
                <Route path="/messages" element={<h1>Hộp thư đến</h1>} />
              </Routes>
            </UserLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;