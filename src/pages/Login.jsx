import React, { useState } from "react";

const Login = ({ onSwitch }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý đăng nhập ở đây
    alert("Đăng nhập thành công!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <img src="/logo_garagehub.png" alt="GarageHub Logo" className="h-16 mb-2" />
          <h2 className="text-2xl font-bold text-purple-700 mb-1">Đăng nhập GarageHub</h2>
          <p className="text-gray-500 text-sm">Vui lòng nhập thông tin để tiếp tục</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
              placeholder="Nhập email..."
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Mật khẩu</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
              placeholder="Nhập mật khẩu..."
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            Đăng nhập
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-500">
          Chưa có tài khoản?{" "}
          <button
            type="button"
            className="text-purple-600 hover:underline"
            onClick={onSwitch}
          >
            Đăng ký
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;