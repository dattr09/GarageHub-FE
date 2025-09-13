import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import LoginAdmin from "./pages/Admin/LoginAdmin";
import Dashboard from "./pages/Admin/Dashboard";
import Users from "./pages/Admin/Users";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Các route công khai */}
        <Route path="/loginadmin" element={<LoginAdmin />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/users" element={<Users />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;