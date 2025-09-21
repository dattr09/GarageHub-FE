import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import AuthContainer from "./pages/AuthContainer";

// Hàm kiểm tra trạng thái đăng nhập
// function PrivateRoute({ children }) {
//   const isAuthenticated = !!localStorage.getItem("token");
//   return isAuthenticated ? children : <Navigate to="/login" replace />;
// }

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Các route công khai */}
        <Route path="/login" element={<AuthContainer />} />
        <Route path="/register" element={<AuthContainer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;