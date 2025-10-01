import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import AuthContainer from "./pages/AuthContainer";
import VerifyEmailPage from "./pages/VerifyEmailPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route mặc định chuyển hướng đến trang Login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Các route công khai */}
        <Route path="/login" element={<AuthContainer />} />
        <Route path="/register" element={<AuthContainer />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;